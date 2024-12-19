const passport = require("passport");
const { STATUS_CODES } = require("../utils/constants"); 

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        status: STATUS_CODES.UNAUTHORIZED,
        data: null,
        message: "Unauthorized: Invalid or expired token",
        error: null,
      });
    }

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        status: STATUS_CODES.UNAUTHORIZED,
        data: null,
        message: "Unauthorized: User not found",
        error: null,
      });
    }

    req.user = user;
    next();
  })(req, res, next); 
};

module.exports = authenticate;