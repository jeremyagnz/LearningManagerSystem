/**
 * supabase.js — Supabase JS client for the LMS backend.
 *
 * Preferred key: SUPABASE_SERVICE_ROLE_KEY — bypasses Row Level Security (RLS)
 * so the server can read/write any row without RLS policies interfering.
 * NEVER expose the service-role key to the browser or to the mobile app.
 *
 * Fallback key: SUPABASE_ANON_KEY — used when the service-role key is not
 * available (e.g. development with only the anon/publishable key on hand).
 * With the anon key the client is subject to RLS policies.
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
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Prefer the service-role key (bypasses RLS); fall back to the anon key only
// in non-production environments where RLS constraints are acceptable.
let supabaseKey = supabaseServiceRoleKey;
if (!supabaseKey) {
  if (supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        'SUPABASE_SERVICE_ROLE_KEY is not set in production. ' +
        'The Supabase JS client will not be initialised to avoid unintended ' +
        'RLS-constrained access. Set SUPABASE_SERVICE_ROLE_KEY to enable ' +
        'Supabase Storage and other server-side Supabase features.'
      );
    } else {
      console.warn(
        'SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to SUPABASE_ANON_KEY ' +
        'for the Supabase JS client. This client will be subject to RLS policies. ' +
        'Set SUPABASE_SERVICE_ROLE_KEY in production for full server-side access.'
      );
      supabaseKey = supabaseAnonKey;
    }
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY ' +
    'must be set. Supabase client features (Storage, etc.) will not work. ' +
    'See backend/.env.example for the required variables.'
  );
}

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null;

module.exports = supabase;
