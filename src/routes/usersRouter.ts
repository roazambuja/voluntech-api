import { Router } from "express";
import registerValidator from "../helpers/validator";
import { registerUser } from "../controllers/authController";

const router = Router();

export default [router.post("/", registerValidator, registerUser)];
