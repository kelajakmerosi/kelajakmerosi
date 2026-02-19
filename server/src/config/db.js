const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
  max: 10,
  idleTimeoutMillis: 30000,
});

/**
 * Connect and verify the database is reachable.
 * Also runs table migrations on startup.
 */
const connectDB = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT NOW()');
    client.release();
    console.log(`[db] PostgreSQL connected — ${rows[0].now}`);
    await runMigrations();
  } catch (err) {
    console.error(`[db] Connection error: ${err.message}`);
    process.exit(1);
  }
};

/**
 * Idempotent table setup — runs on every server start.
 */
const runMigrations = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      password    TEXT,
      avatar      TEXT DEFAULT '',
      role        TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
      provider    TEXT DEFAULT 'local'   CHECK (provider IN ('local', 'google')),
      google_id   TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title       TEXT NOT NULL,
      description TEXT DEFAULT '',
      icon        TEXT DEFAULT '',
      color       TEXT DEFAULT '#6366f1',
      "order"     INT  DEFAULT 0,
      topics      JSONB DEFAULT '[]',
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('[db] Migrations complete');
};

module.exports = { pool, connectDB };
