import passport from "passport";

import LocalPassport from "./oauthLocal.js";
import GooglePassport from "./oauthGoogle.js";
import KakakoPassport from "./oauthKakao.js";
import User from "../models/User.js";

export default (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function (_id, done) {
    User.findById({ _id }, function (err, user) {
      done(err, user);
    });
  });

  LocalPassport();
  GooglePassport();
  KakakoPassport();
};
