const { validationResult } = require("express-validator");
const { STATUS_CODES } = require("../utils/constants");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: STATUS_CODES.BAD_REQUEST,
        data: null,
        message: "Bad Request",
        error: errors.array().map((error) => ({
          field: error.param, 
          value: error.value, 
          message: error.msg, 
        })),
      });
    }

    next();
  };
};

module.exports = validate;
