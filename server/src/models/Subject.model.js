const { pool } = require('../config/db');

// Topics are stored as JSONB inside the subjects row for flexibility.

const findAll = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM subjects ORDER BY "order" ASC'
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM subjects WHERE id = $1 LIMIT 1', [id]
  );
  return rows[0] ?? null;
};

const create = async (data) => {
  const { title, description = '', icon = '', color = '#6366f1', order = 0, topics = [] } = data;
  const { rows } = await pool.query(
    `INSERT INTO subjects (title, description, icon, color, "order", topics)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, icon, color, order, JSON.stringify(topics)]
  );
  return rows[0];
};

const update = async (id, data) => {
  const { title, description, icon, color, order, topics } = data;
  const { rows } = await pool.query(
    `UPDATE subjects
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         icon  = COALESCE($3, icon),
         color = COALESCE($4, color),
         "order" = COALESCE($5, "order"),
         topics = COALESCE($6, topics),
         updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [title, description, icon, color, order, topics ? JSON.stringify(topics) : null, id]
  );
  return rows[0] ?? null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM subjects WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
