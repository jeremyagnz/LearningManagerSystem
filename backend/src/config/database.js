const { Pool } = require('pg');

// Supabase requires SSL for all connections (both direct and via the pooler).
// We enable SSL whenever SUPABASE_URL is present or when running in production.
const useSSL = Boolean(process.env.SUPABASE_URL || process.env.NODE_ENV === 'production');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
