import express from "express";
import { create, remove } from "../controllers/commentController.js";
import { detail, fetch } from "../controllers/conversationController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const conversationRouter = express.Router();

conversationRouter.get("/", fetch);

conversationRouter.get("/:id", detail);

export default conversationRouter;
