import { Router } from "express";
import { upload } from "../middlewares/upload";
import checkToken from "../middlewares/token";
import ProjectController from "../controllers/projectController";
import { requireOrganization } from "../middlewares/requireOrganization";

const router = Router();

export default [
  router.post(
    "/",
    upload.single("headerPicture"),
    checkToken,
    requireOrganization,
    ProjectController.registerProject
  ),
  router.get("/:id", ProjectController.getProject),
  router.get("/user/:id", ProjectController.getUserProjects),
];
