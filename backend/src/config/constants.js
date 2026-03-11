/**
 * constants.js — Shared application-wide constants.
 *
 * Centralising values like role names here means they are defined once and
 * imported wherever they are needed (middleware, controllers, schema), so a
 * future change only requires editing a single file.
 */

const ROLES = Object.freeze({
  STUDENT: 'student',
  TEACHER: 'teacher',
});

/** Convenience array of all valid role strings. */
const ALL_ROLES = Object.values(ROLES);

module.exports = { ROLES, ALL_ROLES };
