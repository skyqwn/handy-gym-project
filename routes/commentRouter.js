import express from "express";
import { create, remove } from "../controllers/commentController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const commentRouter = express.Router();

commentRouter.post("/:gymId", onlyUser, onlyEmailVerified, create);

commentRouter.get(
  "/:gymId/remove/:commentId",
  onlyUser,
  onlyEmailVerified,
  remove
);

export default commentRouter;
