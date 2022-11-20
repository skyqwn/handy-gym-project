import express from "express";
import passport from "passport";
import {
  logout,
  home,
  signin,
  signinPost,
  signup,
  signupPost,
} from "../controllers/globalController.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/signin").get(signin).post(signinPost);

globalRouter.route("/signup").get(signup).post(signupPost);

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

export default globalRouter;
