/**
 * server.js — Entry point for the LMS backend server.
 *
 * Responsibilities:
 *  - Load environment variables via dotenv
 *  - Initialize the database (create tables if needed)
 *  - Bind the Express application to a TCP port and start listening
 *
 * All Express app configuration (middleware, routes, error handling) lives in
 * src/app.js so that the application can be imported without side-effects (e.g.
 * for testing). This file is the only place that actually calls app.listen().
 */

require('dotenv').config();

// Validate required environment variables before anything else.
// Missing vars cause cryptic errors at runtime; catching them here produces a
// clear, actionable message and exits early.
const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌  Missing required environment variables:', missingVars.join(', '));
  console.error('   Copy backend/.env.example to backend/.env and fill in the values.');
  console.error('   Or run `docker-compose up` from the repo root for automatic setup.');
  process.exit(1);
}

const app = require('./src/app');
const { createTables } = require('./src/models/schema');
const { seedDemoUsers } = require('./src/models/seed');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await createTables();
    await seedDemoUsers();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      const maskedDbUrl = (process.env.DATABASE_URL || '').replace(/:[^:@]*@/, ':***@');
      console.log(`Database: ${maskedDbUrl || '(DATABASE_URL not set)'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
