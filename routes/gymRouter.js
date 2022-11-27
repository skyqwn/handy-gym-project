import express from "express";
import {
  detail,
  fetch,
  remove,
  update,
  updatePost,
  upload,
  uploadPost,
} from "../controllers/gymController.js";
import { gymUpload } from "../utils/fileUpload.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";

const gymRouter = express.Router();

gymRouter.get("/", fetch);

gymRouter
  .route("/upload")
  .all(onlyUser, onlyEmailVerified)
  .get(upload)
  .all(gymUpload.array("photos", 10))
  .post(uploadPost);

gymRouter.route("/:gymId").all(onlyUser).get(detail).delete(remove);

gymRouter.route("/:gymId/update").get(update).delete(updatePost);

export default gymRouter;
