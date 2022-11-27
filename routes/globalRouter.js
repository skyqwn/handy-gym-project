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
} from "../controllers/globalController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";
import saveRedirectUrl from "../utils/saveRedirectUrl.js";

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

globalRouter.get("/verify", verifyEmail);

globalRouter.get("/resend-email", resendEmail);

globalRouter.get("/no-access", noAccess);

// GOOGLE Login

globalRouter.get(
  "/auth/google",
  saveRedirectUrl,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

globalRouter.get("/auth/google/callback", googleCallback);

// KAKAO LOGIN

globalRouter.get(
  "/auth/kakao",
  saveRedirectUrl,
  passport.authenticate("kakao")
);

globalRouter.get("/auth/kakao/callback", kakaoCallback);

export default globalRouter;
