import { Router } from "express";
import checkToken from "../middlewares/token";
import PixController from "../controllers/pixController";
import { requireOrganization } from "../middlewares/requireOrganization";

const router = Router();

export default [
  router.post("/", checkToken, requireOrganization, PixController.registerPix),
  router.get("/:id", checkToken, PixController.getPixById),
  router.get("/user/:id", checkToken, PixController.getPixByUser),
  router.put("/:id", checkToken, requireOrganization, PixController.updatePix),
];
