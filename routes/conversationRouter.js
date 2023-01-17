import express from "express";
import { create, remove } from "../controllers/commentController.js";
import { detail } from "../controllers/conversationController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const conversationRouter = express.Router();

conversationRouter.get("/:id", detail);

export default conversationRouter;
