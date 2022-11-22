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
  emailVerify,
  noAccess,
  resendMail,
  googleCallback,
  kakaoCallback,
} from "../controllers/globalController.js";
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

globalRouter.get("/resend-email", resendMail);

globalRouter.get("/no-access", noAccess);

globalRouter.get(
  "/auth/google",
  saveRedirectUrl,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

globalRouter.get("/auth/google/callback", googleCallback);

globalRouter.get(
  "/auth/kakao",
  saveRedirectUrl,
  passport.authenticate("kakao")
);

globalRouter.get("/auth/kakao/callback", kakaoCallback);

globalRouter.get("/verify", emailVerify);

export default globalRouter;
