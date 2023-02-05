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
import { galleryUpload, s3GalleryUpload } from "../utils/fileUpload.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const galleryRouter = express.Router();

galleryRouter.get("/", fetch);

galleryRouter
  .route("/upload")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, upload)
  .post(
    s3GalleryUpload.array("galleryPhotos", 10),
    protectCSRFToken,
    uploadPost
  );

galleryRouter.get("/:galleryId", onlyUser, onlyEmailVerified, detail);
galleryRouter.get("/:galleryId/like", onlyUser, onlyEmailVerified, like);

galleryRouter
  .route("/:galleryId/update")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, update)
  .post(
    s3GalleryUpload.array("galleryPhotos", 10),
    protectCSRFToken,
    updatePost
  );

galleryRouter.get("/:galleryId/remove", onlyUser, remove);

export default galleryRouter;
