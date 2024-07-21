import { Router } from "express";
import registerValidator from "../helpers/validator";
import UserController from "../controllers/userController";
import { upload } from "../middlewares/upload";

const router = Router();

export default [
  router.post("/", upload.single("profilePicture"), registerValidator, UserController.registerUser),
];
