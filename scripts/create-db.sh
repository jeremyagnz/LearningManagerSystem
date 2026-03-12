#!/usr/bin/env bash
# create-db.sh — Creates the lms_db PostgreSQL database.
#
# Usage:
#   bash scripts/create-db.sh [postgres_user] [postgres_host] [postgres_port]
#
# Defaults:
#   user  = postgres
#   host  = localhost
#   port  = 5432
#
# Examples:
#   bash scripts/create-db.sh
#   bash scripts/create-db.sh myuser
#   bash scripts/create-db.sh myuser 127.0.0.1 5433

set -e

DB_USER="${1:-postgres}"
DB_HOST="${2:-localhost}"
DB_PORT="${3:-5432}"
# DB_NAME is intentionally hardcoded to avoid SQL injection risks if this
# script were ever extended to accept the database name as a parameter.
DB_NAME="lms_db"

echo "Creating PostgreSQL database '${DB_NAME}'..."
echo "  Host: ${DB_HOST}:${DB_PORT}"
echo "  User: ${DB_USER}"
echo ""

# Check whether the database already exists before trying to create it.
DB_EXISTS=$(psql -U "${DB_USER}" -h "${DB_HOST}" -p "${DB_PORT}" -tAc \
  "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';" postgres)

if [ "${DB_EXISTS}" = "1" ]; then
  echo "Database '${DB_NAME}' already exists — skipping creation."
else
  psql -U "${DB_USER}" -h "${DB_HOST}" -p "${DB_PORT}" \
    -c "CREATE DATABASE ${DB_NAME};" postgres
  echo ""
  echo "Database '${DB_NAME}' created successfully."
fi

echo ""
echo "Next step: configure your backend/.env with the correct DATABASE_URL and run 'npm run dev' inside backend/."
