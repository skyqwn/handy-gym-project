import express from "express";
import {
  detail,
  fetch,
  like,
  remove,
  update,
  updatePost,
  upload,
  uploadPost,
} from "../controllers/postController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const postRouter = express.Router();

postRouter.get("/", fetch);

postRouter
  .route("/upload")
  .all(onlyUser, onlyEmailVerified, protectCSRFToken)
  .get(upload)
  .post(uploadPost);

postRouter.route("/:postId").all(onlyUser).get(detail);

postRouter.route("/:postId/like").all(onlyUser).get(like);

postRouter
  .route("/:postId/update")
  .all(onlyUser, onlyEmailVerified, protectCSRFToken)
  .get(update)
  .post(updatePost);

postRouter
  .route("/:postId/remove")
  .all(onlyUser, onlyEmailVerified)
  .get(remove);

export default postRouter;
