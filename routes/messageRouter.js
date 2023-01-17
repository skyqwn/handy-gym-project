import express from "express";
import { create } from "../controllers/messageController.js";
import { onlyEmailVerified, onlyUser } from "../utils/protectAuth.js";
import protectCSRFToken from "../utils/protectCSRFToken.js";

const messageRouter = express.Router();

messageRouter.route("/create").all(onlyUser, onlyEmailVerified).post(create);

export default messageRouter;
