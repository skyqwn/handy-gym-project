import passport from "passport";
import { Strategy } from "passport-local";
// import { Strategy as NaverStrategy } from "passport-naver";
// import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../models/User.js";

export default (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { massage: "등록된 이메일이 아닙니다." });
          }
          const checkPassword = bcrypt.compareSync(password, user.password);
          if (!checkPassword) {
            return done(null, false, { massge: "비밀번호가 틀립니다." });
          }
          return done(null, user);
        } catch (error) {
          done(null, false, {
            massage: "서버에 문제가 발생하였습니다. 잠시후 다시 시도해 주세요",
          });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await User.findOne({ email });
      done(null, user);
    } catch (error) {
      done(null, false, {
        message: "서버에 문제가 발생하였습니다. 잠시 후 시도해주세요.",
      });
    }
  });
};
