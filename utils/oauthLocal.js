import passport from "passport";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import User from "../models/User.js";

// strategy 생성

export default () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });

          if (!user) {
            return done(null, false, {
              message: "이메일 또는 비밀번호를 다시 확인해주세요",
            });
          }

          if (user.socialId) {
            return done(null, false, {
              message: `${user.socialType}(으)로 로그인한 이메일입니다`,
            });
          }

          const pwOk = bcrypt.compareSync(password, user.password);

          if (!pwOk) {
            return done(null, false, {
              message: "이메일 또는 비밀번호를 다시 확인해주세요",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
