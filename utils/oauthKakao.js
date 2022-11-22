import { Strategy as KakaoStrategy } from "passport-kakao";
import passport from "passport";
import User from "../models/User.js";

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: "/auth/kakao/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        const redirectUrl = req.session.redirectUrl || "";
        delete req.session.redirectUrl;
        try {
          const existUser = await User.findOne({
            $or: [
              {
                email: profile._json.kakao_account.email,
              },
              {
                socialId: profile.id,
              },
            ],
          });
          if (existUser) {
            existUser.socialId = profile.id;
            existUser.socialType = "KaKao";
            existUser.password = undefined;
            existUser.emailVerify = true;
            await existUser.save();
            return done(null, existUser, { redirectUrl });
          } else {
            const newUser = new User({
              nickname: profile.username,
              email: profile._json.kakao_account.email || undefined,
              avatarUrl: profile._json.properties.thumbnail_image || undefined,
              socialId: profile.id || profile._json.id,
              socialType: "KaKao",
              emailVerify: true,
            });
            await newUser.save();
            return done(null, newUser, { redirectUrl });
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
