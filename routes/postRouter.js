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

const postRouter = express.Router();

postRouter.get("/", fetch);

postRouter.route("/upload").get(upload).post(uploadPost);

postRouter.route("/:gymId").get(detail).delete(remove);

postRouter.route("/:gymId/update").get(update).delete(updatePost);

export default postRouter;
