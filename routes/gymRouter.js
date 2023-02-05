import express from "express";
import {
  detail,
  fetch,
  remove,
  update,
  updatePost,
  upload,
  like,
  uploadPost,
  fetchLikes,
} from "../controllers/gymController.js";
import { gymUpload, s3GymUpload } from "../utils/fileUpload.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const gymRouter = express.Router();

gymRouter.get("/", fetch);

gymRouter
  .route("/upload")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, upload)
  .post(s3GymUpload.array("gymPhotos", 10), protectCSRFToken, uploadPost);

gymRouter.route("/:gymId").all(onlyUser, onlyEmailVerified).get(detail);

gymRouter.route("/:gymId/like").all(onlyUser, onlyEmailVerified).get(like);

gymRouter
  .route("/:gymId/update")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, update)
  .post(s3GymUpload.array("gymPhotos", 10), protectCSRFToken, updatePost);

gymRouter.route("/:gymId/remove").all(onlyUser, onlyEmailVerified).get(remove);

export default gymRouter;
