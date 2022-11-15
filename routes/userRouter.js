import express from "express";
import {
  findEmail,
  findEmailPost,
  userUpdate,
  userUpdatePost,
  detail,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/find-email").get(findEmail).post(findEmailPost);

userRouter.route("/:userId").get(detail);

userRouter.route("/:userId/update").get(userUpdate).post(userUpdatePost);

export default userRouter;
