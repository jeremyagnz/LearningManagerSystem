/**
 * validate.js — Shared request-validation helpers built on express-validator.
 *
 * Each exported array is a chain of validation rules + a final handler that
 * collects any errors and short-circuits the request with a 400 response so
 * controllers never receive invalid data.
 */

const { body, validationResult } = require('express-validator');
const { ALL_ROLES } = require('../config/constants');

/**
 * Reads express-validator's result bag and, if there are errors, sends a 400
 * response listing them.  Designed to be the last item in a validation chain.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array();
    return res.status(400).json({ message: errorList[0].msg, errors: errorList });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(ALL_ROLES).withMessage(`Role must be one of: ${ALL_ROLES.join(', ')}`),

  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin };
