import passport from "passport";
import passportKakao from "passport-kakao";
const KakaoStrategy = passportKakao.Strategy;
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";

let callbackURL;

if (process.env.NODE_ENV === "Production") {
  callbackURL = "https://www.handygym.kr";
} else {
  callbackURL = "http://localhost:5050/auth/kakao/callback";
}

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT,
        callbackURL,
        passReqToCallback: true,
      },
      async (req, authToken, refreshToken, profile, done) => {
        const redirectUrl = req.session.redirectUrl || "/";
        delete req.session.redirectUrl;
        try {
          const existUser = await User.findOne({
            $or: [
              {
                email: profile._json.kakao_account.email,
              },
              { socialId: profile.id },
            ],
          });
          if (existUser) {
            existUser.socialId = profile.id;
            existUser.socialType = "카카오";
            existUser.password = undefined;
            existUser.email_verified = true;
            await existUser.save();
            return done(null, existUser, { redirectUrl });
          } else {
            const newUser = new User({
              nickname: profile.username || profile._json.properties.nickname,
              email:
                profile._json.kakao_account.email ||
                `${profile._json.id}@kakao.com`,
              avatarUrl: "",
              // avatarUrl: profile._json.properties.thumbnail_image || "",
              socialId: profile.id || profile._json.id,
              socialType: "카카오",
              email_verified: true,
            });
            await newUser.save();
            return done(null, newUser, { redirectUrl });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
