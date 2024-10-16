import express from "express";
import { deleteMessage, editMessage, getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/middleware.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/delete/:id", protectRoute, deleteMessage);
router.post("/edit/:id", protectRoute, editMessage);

export default router;