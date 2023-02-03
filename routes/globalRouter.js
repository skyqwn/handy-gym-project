import express from "express";
import passport from "passport";
import {
  googleCallback,
  home,
  kakaoCallback,
  logout,
  signin,
  signinPost,
  signup,
  signupPost,
  verifyEmail,
  resendEmail,
  noAccess,
  like,
} from "../controllers/globalController.js";
import {
  onlyEmailVerified,
  onlyUser,
  onlyPublic,
} from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";
import saveRedirectUrl from "../utils/saveRedirectUrl.js";

const globalRouter = express.Router();

globalRouter.get("/", home);

globalRouter
  .route("/signin")
  .all(onlyPublic, protectCSRFToken)
  .get(signin)
  .post(signinPost);

globalRouter
  .route("/signup")
  .all(onlyPublic, protectCSRFToken)
  .get(signup)
  .post(signupPost);

globalRouter.get("/logout", onlyUser, onlyEmailVerified, logout);

globalRouter.get("/like", onlyUser, onlyEmailVerified, like);

globalRouter.get("/verify", onlyPublic, verifyEmail);

globalRouter.get("/no-access", noAccess);

// GOOGLE Login

globalRouter.get(
  "/auth/google",
  saveRedirectUrl,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

globalRouter.get("/auth/google/callback", onlyPublic, googleCallback);

// KAKAO LOGIN

globalRouter.get(
  "/auth/kakao",
  saveRedirectUrl,
  passport.authenticate("kakao")
);

globalRouter.get("/auth/kakao/callback", onlyPublic, kakaoCallback);

export default globalRouter;
