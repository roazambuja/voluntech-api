import { Router } from "express";
import checkToken from "../middlewares/token";
import MessageController from "../controllers/messageController";

const router = Router();

export default [router.post("/", checkToken, MessageController.sendMessage)];
