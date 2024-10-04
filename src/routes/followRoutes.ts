import { Router } from "express";
import checkToken from "../middlewares/token";
import requireVolunteer from "../middlewares/requireVolunteer";
import FollowController from "../controllers/followController";

const router = Router();

export default [
  router.post("/", checkToken, requireVolunteer, FollowController.followOrganization),
  router.get("/:organization", checkToken, requireVolunteer, FollowController.alreadyFollows),
];
