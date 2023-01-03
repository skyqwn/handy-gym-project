import express from "express";
import {
  detail,
  fetch,
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
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, upload)
  .post(protectCSRFToken, uploadPost);

postRouter.route("/:postId").all(onlyUser).get(detail);

postRouter
  .route("/:postId/update")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, update)
  .post(protectCSRFToken, updatePost);

postRouter
  .route("/:postId/remove")
  .all(onlyUser, onlyEmailVerified)
  .get(remove);

export default postRouter;
