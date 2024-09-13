import { Router } from "express";
import SocialMediaController from "../controllers/socialMediaController";
import { requireOrganization } from "../middlewares/requireOrganization";
import checkToken from "../middlewares/token";

const router = Router();

export default [
  router.post("/", checkToken, requireOrganization, SocialMediaController.registerSocialMedia),
  router.get("/:id", checkToken, SocialMediaController.getSocialMediaById),
  router.get("/user/:id", checkToken, SocialMediaController.getSocialMediaByUser),
];
