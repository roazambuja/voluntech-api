import { Router } from "express";
import UserController from "../controllers/userController";
import { upload } from "../middlewares/upload";
import checkToken from "../middlewares/token";

const router = Router();

export default [
  router.post("/", upload.single("profilePicture"), UserController.registerUser),
  router.get("/:id", checkToken, UserController.getUser),
];
