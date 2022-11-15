import express from "express";
import {
  detail,
  fetch,
  remove,
  update,
  upload,
  uploadPost,
} from "../controllers/gymController.js";

const gymRouter = express.Router();

gymRouter.get("/", fetch);

gymRouter.route("/upload").get(upload).post(uploadPost);

gymRouter.route("/:gymId").get(detail).delete(remove);

gymRouter.route("/:gymId/update").get(update).post(uploadPost);

export default gymRouter;
