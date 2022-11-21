import express from "express";
import protectCSRFToken from "../utils/protectCSRFToken.js";
import passport from "passport";
import {
  logout,
  home,
  signin,
  signinPost,
  signup,
  signupPost,
  loginVerify,
} from "../controllers/globalController.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter
  .route("/signin")
  .all(protectCSRFToken)
  .get(signin)
  .post(signinPost);

globalRouter
  .route("/signup")
  .all(protectCSRFToken)
  .get(signup)
  .post(signupPost);

globalRouter.get("/logout", logout);

globalRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

globalRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/signin",
  })
);

globalRouter.get("/auth/kakao", passport.authenticate("kakao"));

globalRouter.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", {
    successRedirect: "/",
    failureRedirect: "/signin",
  })
);

globalRouter.get("/verify", loginVerify);

export default globalRouter;
