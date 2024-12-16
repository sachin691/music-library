// src/config/passport.js

const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models"); // Assuming you have a User model for authentication
const { JWT_SECRET } = process.env; // Your JWT secret key (use dotenv to manage environment variables)

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
  secretOrKey: JWT_SECRET, // Use your secret key for JWT verification
};

const jwtStrategy = new Strategy(jwtOptions, async (jwt_payload, done) => {
  try {
    // Find user by the ID from JWT payload
    const user = await User.findByPk(jwt_payload.id);

    if (!user) {
      return done(null, false); // User not found, authentication fails
    }

    return done(null, user); // User found, authentication successful
  } catch (error) {
    return done(error, false); // If there's any error, fail the authentication
  }
});

// Initialize passport with the JWT strategy
passport.use(jwtStrategy);

module.exports = passport;
