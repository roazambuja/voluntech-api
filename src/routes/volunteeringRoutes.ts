import { Router } from "express";
import { requireOrganization } from "../middlewares/requireOrganization";
import checkToken from "../middlewares/token";
import VolunteeringController from "../controllers/volunteeringController";

const router = Router();

export default [
  router.post("/", checkToken, requireOrganization, VolunteeringController.createVolunteering),
  router.get("/:id", VolunteeringController.getVolunteeringById),
  router.get("/project/:id", VolunteeringController.getVolunteeringByProject),
];
