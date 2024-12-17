const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");
const { JWT_SECRET } = process.env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
  secretOrKey: JWT_SECRET, 
};

const jwtStrategy = new Strategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id);

    if (!user) {
      return done(null, false); 
    }

    return done(null, user); 
  } catch (error) {
    return done(error, false); 
  }
});

passport.use(jwtStrategy);

module.exports = passport;
