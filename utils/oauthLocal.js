import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";

export default () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "등록된 유저가 아닙니다" });
          }

          if (user.socialId) {
            return done(null, false, {
              message: `
            이미 소셜로 가입되어있는 아이디입니다.
            `,
            });
          }

          const checkedPassword = bcrypt.compareSync(password, user.password);
          if (!checkedPassword) {
            return done(null, false, { massge: "비밀번호가 틀립니다." });
          } else {
            return done(null, user);
          }
        } catch (error) {
          console.log(error);
          done(error, false, {
            massage: "서버에 문제가 발생하였습니다. 잠시후 다시 시도해 주세요",
          });
        }
      }
    )
  );
};
