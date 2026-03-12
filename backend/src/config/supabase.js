/**
 * supabase.js — Supabase JS client for the LMS backend.
 *
 * This client uses the service-role key so it can bypass Row Level Security
 * (RLS) from the server side. NEVER expose the service-role key to the browser
 * or to the mobile app.
 *
 * The client is used for Supabase-specific features such as Storage (file
 * uploads) and is exported here so all modules share a single instance.
 *
 * Supabase also provides a standard PostgreSQL connection that works with the
 * existing `pg` pool in database.js — set DATABASE_URL to your Supabase
 * connection string as shown in backend/.env.example.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. ' +
    'Supabase client features (Storage, etc.) will not work. ' +
    'See backend/.env.example for the required variables.'
  );
}

const supabase = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })
  : null;

module.exports = supabase;
