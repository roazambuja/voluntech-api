import { Router } from "express";
import checkToken from "../middlewares/token";
import UpdatesController from "../controllers/updatesController";

const router = Router();

export default [
  router.get("/", checkToken, UpdatesController.getFollowedUpdates),
  router.get("/project/:id", UpdatesController.getProjectUpdates),
  router.get("/organization/:id", UpdatesController.getOrganizationUpdates),
];
