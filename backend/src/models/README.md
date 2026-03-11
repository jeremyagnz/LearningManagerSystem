# backend/src/models

Database schema definitions and query helpers.

`schema.js` contains the `CREATE TABLE IF NOT EXISTS` statements that
initialize the PostgreSQL database on first run.

As the project grows, individual model files can be added here (one per table)
to encapsulate raw SQL queries or an ORM model class, keeping database access
separate from controller logic.
