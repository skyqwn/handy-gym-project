import express from "express";
import {
  detail,
  fetch,
  gymRemove,
  update,
  upload,
  uploadPost,
} from "../controllers/gymController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";

const gymRouter = express.Router();

gymRouter.get("/", fetch);

gymRouter
  .route("/upload")
  .all(onlyUser, onlyEmailVerified)
  .get(upload)
  .post(uploadPost);

gymRouter.route("/:gymId").all(onlyUser).get(detail).delete(gymRemove);

gymRouter.route("/:gymId/update").get(update).post(uploadPost);

export default gymRouter;
