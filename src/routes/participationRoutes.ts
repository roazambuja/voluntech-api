import { Router } from "express";
import checkToken from "../middlewares/token";
import requireVolunteer from "../middlewares/requireVolunteer";
import ParticipationController from "../controllers/participationController";
import { requireOrganization } from "../middlewares/requireOrganization";

const router = Router();

export default [
  router.post("/", checkToken, requireVolunteer, ParticipationController.createParticipation),
  router.get(
    "/:volunteering",
    checkToken,
    requireVolunteer,
    ParticipationController.alreadyParticipates
  ),
  router.put(
    "/:id",
    checkToken,
    requireOrganization,
    ParticipationController.answerParticipationRequest
  ),
  router.get("/", checkToken, requireOrganization, ParticipationController.getPendingRequests),
  router.get("/project/:id", checkToken, ParticipationController.getProjectParticipation),
];
