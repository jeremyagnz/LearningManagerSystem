-- ============================================================
-- LMS — Demo Seed Data
-- ============================================================
-- Creates two demo accounts for testing and development.
-- Passwords are bcrypt hashes of "demo1234" (cost factor 12).
--
-- Run after 001_initial_schema.sql in the Supabase SQL Editor.
-- ============================================================

INSERT INTO users (name, email, password, role)
VALUES
  (
    'Profesor Demo',
    'demo.teacher@lms.com',
    '$2b$12$bW9dSSjy/MJ2ogoWxZM5E.VJrvHB.n0ZOr0QPy8FIcVDMKu6PZ.Na',
    'teacher'
  ),
  (
    'Estudiante Demo',
    'demo.student@lms.com',
    '$2b$12$bW9dSSjy/MJ2ogoWxZM5E.VJrvHB.n0ZOr0QPy8FIcVDMKu6PZ.Na',
    'student'
  )
ON CONFLICT (email) DO NOTHING;
