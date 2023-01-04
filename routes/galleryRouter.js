import express from "express";
import {
  detail,
  fetch,
  remove,
  update,
  updatePost,
  upload,
  uploadPost,
  fetchLikes,
} from "../controllers/galleryController.js";
import { galleryUpload } from "../utils/fileUpload.js";

import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const galleryRouter = express.Router();

galleryRouter.get("/", fetch);

galleryRouter.get("/like", fetchLikes);

galleryRouter
  .route("/upload")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, upload)
  .post(galleryUpload.array("photos", 10), protectCSRFToken, uploadPost);

galleryRouter.route("/:galleryId").all(onlyUser, onlyEmailVerified).get(detail);

// galleryRouter
//   .route("/:galleryId/like")
//   .all(onlyUser, onlyEmailVerified)
//   .get(like);

galleryRouter
  .route("/:galleryId/update")
  .all(onlyUser, onlyEmailVerified)
  .get(protectCSRFToken, update)
  .post(galleryUpload.array("photos", 10), protectCSRFToken, updatePost);

galleryRouter
  .route("/:galleryId/remove")
  .all(onlyUser, onlyEmailVerified)
  .get(remove);

export default galleryRouter;
