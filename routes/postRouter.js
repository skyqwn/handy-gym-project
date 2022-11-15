import express from "express";
import {
  detail,
  fetch,
  remove,
  update,
  upload,
  uploadPost,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.get("/", fetch);

postRouter.route("/upload").get(upload).post(uploadPost);

postRouter.route("/:gymId").get(detail).delete(remove);

postRouter.route("/:gymId/update").get(update).post(uploadPost);

export default postRouter;
