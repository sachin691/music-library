// src/utils/responseUtil.js

// Function to send success responses
const successResponse = (res, data, message = "Operation successful", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data: data || null,
    message,
  });
};

// Function to send error responses
const errorResponse = (res, error) => {
  const statusCode = error.statusCode || 500; // Default to 500 (Internal Server Error) if not specified
  return res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message: error.message || "Internal Server Error", // Provide a custom error message if available
    },
  });
};

module.exports = { successResponse, errorResponse };
