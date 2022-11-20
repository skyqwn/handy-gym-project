import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/User.js";

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/auth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          const existUser = await User.findOne({
            $or: [
              { email: profile._json.email || profile.emails[0].value },
              { socialId: profile.id },
            ],
          });
          if (existUser) {
            existUser.socialId = profile.id;
            existUser.socialType = "구글";
            existUser.password = undefined;
            await existUser.save();
            return done(null, existUser);
          } else {
            const newUser = new User({
              nickname: profile._json.name,
              email: profile._json.email,
              avatarUrl: profile._json.picture || undefined,
              socialId: profile.id || profile._json.sub,
              socialType: "Google",
            });
            await newUser.save();
            return done(null, newUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
