/**
 * seed.js — Creates demo accounts so developers and reviewers can log in
 * immediately without having to register.
 *
 * Demo credentials (always available in development):
 *   Teacher  →  demo.teacher@lms.com  /  demo1234
 *   Student  →  demo.student@lms.com  /  demo1234
 */

const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const DEMO_USERS = [
  {
    name: 'Profesor Demo',
    email: 'demo.teacher@lms.com',
    password: 'demo1234',
    role: 'teacher',
  },
  {
    name: 'Estudiante Demo',
    email: 'demo.student@lms.com',
    password: 'demo1234',
    role: 'student',
  },
];

const seedDemoUsers = async () => {
  if (process.env.NODE_ENV === 'production') return;

  try {
    for (const u of DEMO_USERS) {
      const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (rows.length === 0) {
        const hashed = await bcrypt.hash(u.password, 12);
        await pool.query(
          'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
          [u.name, u.email, hashed, u.role]
        );
        console.log(`Demo user created: ${u.email}`);
      }
    }
  } catch (err) {
    console.error('Failed to seed demo users:', err.message);
  }
};

module.exports = { seedDemoUsers };
