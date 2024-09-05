import { Router } from "express";
import { upload } from "../middlewares/upload";
import checkToken from "../middlewares/token";
import ProjectController from "../controllers/projectController";

const router = Router();

export default [
  router.post("/", upload.single("headerPicture"), checkToken, ProjectController.registerProject),
  router.get("/user/:id", checkToken, ProjectController.getUserProjects),
];
