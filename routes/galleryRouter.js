import express from "express";
import {
  fetch,
  upload,
  uploadPost,
  detail,
  update,
  updatePost,
  remove,
  like,
} from "../controllers/galleryController.js";
import { galleryUpload } from "../utils/fileUpload.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const galleryRouter = express.Router();

galleryRouter.get("/", onlyUser, onlyEmailVerified, fetch);

galleryRouter
  .route("/upload")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, upload)
  .post(galleryUpload.array("photos", 10), protectCSRFToken, uploadPost);

galleryRouter.get("/:galleryId", onlyUser, detail);
galleryRouter.get("/:galleryId/like", onlyUser, like);

galleryRouter
  .route("/:galleryId/update")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, update)
  .post(galleryUpload.array("photos", 10), protectCSRFToken, updatePost);

galleryRouter.get("/:galleryId/remove", onlyUser, remove);

export default galleryRouter;
