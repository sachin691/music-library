// src/utils/errors.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500; // Default to 500 if not provided
    this.name = this.constructor.name; // Name of the error (e.g., AppError)
    Error.captureStackTrace(this, this.constructor); // Captures the stack trace
  }
}

// Specific Error Types

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden action") {
    super(message, 403);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

module.exports = { AppError, NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError, InternalServerError };
