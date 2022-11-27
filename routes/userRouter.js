import express from "express";
import {
  detail,
  findEmail,
  findEmailPost,
  update,
  updatePost,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/find-email").get(findEmail).post(findEmailPost);

userRouter.route("/:userId").get(detail);

userRouter.route("/:userId/update").get(update).delete(updatePost);

export default userRouter;
