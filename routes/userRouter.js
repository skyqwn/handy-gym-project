import express from "express";
import { detail, updatePost } from "../controllers/userController.js";
import { S3MulterUpload } from "../utils/fileUpload.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";
import saveCurrentUrl from "../utils/saveCurrentUrl.js";
const userRouter = express.Router();

userRouter.post(
  "/update",
  onlyUser,
  onlyEmailVerified,
  // avatarUpload.single("avatar"),
  S3MulterUpload.single("avatar"),
  protectCSRFToken,
  updatePost
);

userRouter
  .route("/:userId")
  .get(
    onlyUser,
    onlyEmailVerified,
    S3MulterUpload.single("file"),
    protectCSRFToken,
    saveCurrentUrl,
    detail
  );

export default userRouter;
