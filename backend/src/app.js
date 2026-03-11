/**
 * app.js — Express application factory for the LMS backend.
 *
 * Configures and exports the Express app without starting the HTTP server.
 * Keeping app creation and server startup separate lets tests import the app
 * without binding to a port and makes the code easier to reason about.
 *
 * The actual server start (app.listen) lives in the top-level server.js.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { defaultLimiter, authLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const materialRoutes = require('./routes/materials');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/subjects', defaultLimiter, subjectRoutes);
app.use('/api/assignments', defaultLimiter, assignmentRoutes);
app.use('/api/submissions', defaultLimiter, submissionRoutes);
app.use('/api/materials', defaultLimiter, materialRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
