import express from "express";
import { detail, updatePost } from "../controllers/userController.js";
import { s3AvatarUpload } from "../utils/fileUpload.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";
import saveCurrentUrl from "../utils/saveCurrentUrl.js";
const userRouter = express.Router();

userRouter.post(
  "/update",
  onlyUser,
  onlyEmailVerified,
  // avatarUpload.single("avatar"),
  s3AvatarUpload.single("avatar"),
  protectCSRFToken,
  updatePost
);

userRouter
  .route("/:userId")
  .get(
    onlyUser,
    onlyEmailVerified,
    s3AvatarUpload.single("file"),
    protectCSRFToken,
    saveCurrentUrl,
    detail
  );

export default userRouter;
