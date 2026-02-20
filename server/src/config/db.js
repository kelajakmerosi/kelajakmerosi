const { Pool } = require('pg');
const { logger } = require('./logger');

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
    logger.info({ now: rows[0].now }, '[db] PostgreSQL connected');
    await runMigrations();
  } catch (err) {
    logger.error({ err }, '[db] Connection error');
    process.exit(1);
  }
};

/**
 * Idempotent table setup — runs on every server start.
 */
const runMigrations = async () => {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject_id            TEXT NOT NULL,
      topic_id              TEXT NOT NULL,
      status                TEXT DEFAULT 'locked'
                            CHECK (status IN ('locked', 'inprogress', 'onhold', 'completed')),
      video_watched         BOOLEAN DEFAULT FALSE,
      quiz_score            INT,
      quiz_answers          JSONB DEFAULT '{}'::jsonb,
      quiz_submitted        BOOLEAN DEFAULT FALSE,
      mastery_score         INT,
      quiz_attempts         INT DEFAULT 0,
      time_on_task_sec      INT DEFAULT 0,
      resume_question_index INT DEFAULT 0,
      last_activity_at      TIMESTAMPTZ DEFAULT NOW(),
      completed_at          TIMESTAMPTZ,
      created_at            TIMESTAMPTZ DEFAULT NOW(),
      updated_at            TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (user_id, subject_id, topic_id)
    );

    ALTER TABLE user_lesson_progress
      ADD COLUMN IF NOT EXISTS quiz_total_questions INT;

    CREATE TABLE IF NOT EXISTS user_quiz_attempts (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject_id       TEXT NOT NULL,
      topic_id         TEXT NOT NULL,
      quiz_score       INT NOT NULL,
      mastery_score    INT NOT NULL,
      total_questions  INT NOT NULL,
      quiz_answers     JSONB DEFAULT '{}'::jsonb,
      attempted_at     TIMESTAMPTZ DEFAULT NOW(),
      created_at       TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_activity_days (
      user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      activity_date DATE NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, activity_date)
    );

    CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user
      ON user_lesson_progress(user_id);

    CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_last_activity
      ON user_lesson_progress(user_id, last_activity_at DESC);

    CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user
      ON user_quiz_attempts(user_id, attempted_at DESC);

    CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_topic
      ON user_quiz_attempts(user_id, subject_id, topic_id, attempted_at DESC);
  `);
  logger.info('[db] Migrations complete');
};

module.exports = { pool, connectDB };
