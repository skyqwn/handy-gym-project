import express from "express";
import { create, remove } from "../controllers/commentController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const commentRouter = express.Router();

commentRouter.post("/:whereId", onlyUser, onlyEmailVerified, create);

commentRouter.get(
  "/:whereId/remove/:commentId",
  onlyUser,
  onlyEmailVerified,
  remove
);

export default commentRouter;
