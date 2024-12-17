const { validationResult } = require("express-validator");
const { STATUS_CODES } = require("../utils/constants");

const validate = (validations) => {
  return async (req, res, next) => {
    // Run validations
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Custom error response format with defined status codes
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request",
        error: errors.array().map((error) => ({
          field: error.param, // Field name
          value: error.value, // Value that caused the error
          message: error.msg, // Validation error message
        })),
      });
    }

    next();
  };
};

module.exports = validate;
