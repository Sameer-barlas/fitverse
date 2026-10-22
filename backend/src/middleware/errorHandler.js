import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function errorHandler(err, _req, res, _next) {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const isEmail = Boolean(err.keyPattern && err.keyPattern.email);
    code = isEmail ? 'EMAIL_TAKEN' : 'CONFLICT';
    message = isEmail ? 'An account with this email already exists' : 'Resource already exists';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation error';
    details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  } else if (env.NODE_ENV !== 'production') {
    message = err.message || message;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  const response = {
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };

  res.status(statusCode).json(response);
}
