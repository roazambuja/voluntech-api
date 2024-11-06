import { Router } from "express";
import checkToken from "../middlewares/token";
import MessageController from "../controllers/messageController";

const router = Router();

export default [
  router.post("/", checkToken, MessageController.sendMessage),
  router.get("/user", checkToken, MessageController.getUserConversations),
  router.get("/user/unread", checkToken, MessageController.hasUnreadMessages),
  router.get("/:id", checkToken, MessageController.getMessages),
  router.put("/user/:id", checkToken, MessageController.markMessagesAsSeen),
];
