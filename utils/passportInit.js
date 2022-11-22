import passport from "passport";

import LocalPassport from "./oauthLocal.js";
import GooglePassport from "./oauthGoogle.js";
import KakaoPassport from "./oauthGoogle.js";
import User from "../models/User.js";

export default (app) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await User.findOne({ _id });
      done(null, user);
    } catch (error) {
      done(null, false, {
        message: "서버에 문제가 발생하였습니다. 잠시후 시도해주세요.",
      });
    }
  });

  LocalPassport();
  GooglePassport();
  KakaoPassport();

  app.use(passport.initialize());
  app.use(passport.session());
};
