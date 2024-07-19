import { Router } from "express";
import registerValidator from "../helpers/validator";
import { registerUser } from "../controllers/authController";
import { upload } from "../middlewares/upload";

const router = Router();

export default [router.post("/", upload.single("profilePicture"), registerValidator, registerUser)];
