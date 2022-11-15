import express from "express";
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

export default globalRouter;
