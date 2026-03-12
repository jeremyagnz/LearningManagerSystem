-- ============================================================
-- LMS — Initial Schema Migration
-- ============================================================
-- Run this script in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
--
-- It is safe to run multiple times (all statements use
-- IF NOT EXISTS / ON CONFLICT DO NOTHING guards).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. users
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(50)  NOT NULL CHECK (role IN ('student', 'teacher')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- 2. subjects
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- 3. enrollments
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (student_id, subject_id)
);

-- ────────────────────────────────────────────────────────────
-- 4. assignments
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id          SERIAL PRIMARY KEY,
  subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  file_url    VARCHAR(500),
  due_date    TIMESTAMP,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────────────────────
-- 5. submissions
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id            SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url      VARCHAR(500),
  grade         DECIMAL(5,2),
  feedback      TEXT,
  submitted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (assignment_id, student_id)
);

-- ────────────────────────────────────────────────────────────
-- 6. materials
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS materials (
  id            SERIAL PRIMARY KEY,
  subject_id    INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  content_url   VARCHAR(500),
  material_type VARCHAR(50) CHECK (material_type IN ('pdf', 'video', 'link', 'other')),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
