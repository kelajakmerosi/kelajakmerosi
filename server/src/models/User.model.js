const bcrypt     = require('bcryptjs');
const { pool }   = require('../config/db');

const PUBLIC_USER_FIELDS = Object.freeze([
  'id',
  'name',
  'email',
  'avatar',
  'role',
  'created_at',
]);

/**
 * Strip sensitive fields before sending to client using an explicit allow-list.
 * @param {object} row - raw database row
 */
const toPublic = (row) => {
  if (!row || typeof row !== 'object') return null;
  const safe = {};
  for (const field of PUBLIC_USER_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(row, field)) safe[field] = row[field];
  }

  return {
    id: safe.id,
    name: safe.name,
    email: safe.email,
    avatar: safe.avatar,
    role: safe.role,
    createdAt: safe.created_at,
  };
};

/**
 * Find a user by email.
 * Pass `{ withPassword: true }` to include the hashed password.
 */
const findByEmail = async (email, { withPassword = false } = {}) => {
  const cols = withPassword
    ? 'id, name, email, password, avatar, role, provider, created_at'
    : 'id, name, email, avatar, role, provider, created_at';
  const { rows } = await pool.query(
    `SELECT ${cols} FROM users WHERE email = $1 LIMIT 1`,
    [email.toLowerCase()]
  );
  return rows[0] ?? null;
};

/**
 * Find a user by primary key.
 */
const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, avatar, role, provider, created_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] ?? null;
};

/**
 * Return all users in a public-safe shape for admin list views.
 */
const listPublicSummaries = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, email, avatar, role, provider, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT 200`
  );
  return rows.map((row) => toPublic(row)).filter(Boolean);
};

/**
 * Create a new local user (hashes password automatically).
 */
const create = async ({ name, email, password, provider = 'local', googleId = null }) => {
  const hashed = password ? await bcrypt.hash(password, 12) : null;
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, provider, google_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, avatar, role, provider, created_at`,
    [name, email.toLowerCase(), hashed, provider, googleId]
  );
  return rows[0];
};

/**
 * Update profile fields for a user.
 */
const update = async (id, { name, avatar }) => {
  const { rows } = await pool.query(
    `UPDATE users SET name = COALESCE($1, name), avatar = COALESCE($2, avatar),
     updated_at = NOW() WHERE id = $3
     RETURNING id, name, email, avatar, role, created_at`,
    [name, avatar, id]
  );
  return rows[0] ?? null;
};

/**
 * Upsert a Google OAuth user — insert on first login, update avatar on subsequent.
 */
const upsertGoogle = async ({ googleId, email, name, avatar }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, avatar, provider, google_id)
     VALUES ($1, $2, $3, 'google', $4)
     ON CONFLICT (email) DO UPDATE
       SET google_id = EXCLUDED.google_id,
           avatar    = COALESCE(EXCLUDED.avatar, users.avatar),
           provider  = 'google',
           updated_at = NOW()
     RETURNING id, name, email, avatar, role, provider, created_at`,
    [name, email.toLowerCase(), avatar ?? '', googleId]
  );
  return rows[0];
};

module.exports = { findByEmail, findById, listPublicSummaries, create, update, upsertGoogle, toPublic };
