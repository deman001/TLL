import express from "express";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
import ChatController from '../controllers/chatController.js'

/* READ */
router.get("/get-all-chats/:id", verifyToken, ChatController.getAllChats);

router.get("/get-all-messages/:id", verifyToken, ChatController.getAllMessages);

router.post("/send-message", verifyToken, ChatController.sendMessage);

router.post("/create-chat", verifyToken, ChatController.createChat);
router.post("/update-message/:message_id", verifyToken, ChatController.updateMessage);
// router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
// router.patch("/:id/like", verifyToken, likePost);

export default router;
