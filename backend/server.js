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
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
