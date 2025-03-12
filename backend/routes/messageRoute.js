import Router from "express";
import {
  getMessages,
  createConversation,
  getConversations,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);
router.get("/conversations", getConversations);
router.get("/:conversationId", getMessages);
router.post("/create-conversation", createConversation);

export default router;
