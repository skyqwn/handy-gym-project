import express from "express";
import {
  changePassword,
  changePasswordPost,
  detail,
  findEmail,
  findEmailPost,
  me,
  update,
  updatePost,
} from "../controllers/userController.js";
import { avatarUpload } from "../utils/fileUpload.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const userRouter = express.Router();

userRouter.route("/find-email").get(findEmail).post(findEmailPost);

userRouter.route("/me").get(onlyUser, onlyEmailVerified, me);

userRouter.post(
  "/update",
  onlyUser,
  onlyEmailVerified,
  avatarUpload.single("avatar"),
  protectCSRFToken,
  updatePost
);

userRouter
  .route("/change-password")
  .all(onlyUser, onlyEmailVerified)
  .get(changePassword)
  .post(changePasswordPost);

userRouter
  .route("/:userId")
  .get(onlyUser, onlyEmailVerified, protectCSRFToken, detail);

export default userRouter;
