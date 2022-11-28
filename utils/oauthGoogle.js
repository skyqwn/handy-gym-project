import passport from "passport";
import passportGoogle from "passport-google-oauth2";
const GoogleStrategy = passportGoogle.Strategy;
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:5050/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, authToken, refreshToken, profile, done) => {
        const redirectUrl = req.session.redirectUrl || "/";
        delete req.session.redirectUrl;
        try {
          const existUser = await User.findOne({
            $or: [
              { email: profile._json.email || profile.mails[0].value },
              { socialId: profile.id },
            ],
          });
          if (existUser) {
            existUser.socialId = profile.id;
            existUser.socialType = "구글";
            existUser.password = undefined;
            existUser.email_verified = true;
            await existUser.save();
            return done(null, existUser, {
              redirectUrl,
            });
          } else {
            const newUser = new User({
              nickname: profile._json.name || "이름없음",
              email: profile._json.email || undefined,
              avatarUrl: profile._json.picture || "",
              socialId: profile.id || profile._json.sub,
              socialType: "구글",
              email_verified: true,
            });
            await newUser.save();
            return done(null, newUser, {
              redirectUrl,
            });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
