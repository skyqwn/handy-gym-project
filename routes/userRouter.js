import express from "express";
import {
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

userRouter.route("/me").get(me);

userRouter
  .route("/update")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, update)
  .post(avatarUpload.single("avatar"), protectCSRFToken, updatePost);

// userRouter.route("/remove").all(onlyUser, onlyEmailVerified).get(remove);

userRouter.route("/:userId").get(detail);
export default userRouter;
