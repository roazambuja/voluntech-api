import { Router } from "express";
import checkToken from "../middlewares/token";
import requireVolunteer from "../middlewares/requireVolunteer";
import ParticipationController from "../controllers/participationController";

const router = Router();

export default [
  router.post("/", checkToken, requireVolunteer, ParticipationController.createParticipation),
  router.get(
    "/:volunteering",
    checkToken,
    requireVolunteer,
    ParticipationController.alreadyParticipates
  ),
];
