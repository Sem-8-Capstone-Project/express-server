const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users");
require("dotenv").config();

const allowedDomain = "mitwpu.edu.in";
module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true,
        proxy: true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        if (profile.emails[0].value.endsWith(allowedDomain)) {
          let existingUser = await User.findOne({ id: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          } else {
            const newUser = new User({
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });
            await newUser.save();
            return done(null, newUser);
          }
        } else {
          console.log(
            `Login attempt from unauthorized domain: ${profile.emails[0]}`
          );
          return done(null, false, {
            message:
              "Unauthorized domain. Please use a work or school account associated with " +
              allowedDomain,
          });
        }
      }
    )
  );
};
