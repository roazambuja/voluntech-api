import { Router } from "express";
import AddressController from "../controllers/addressController";
import checkToken from "../middlewares/token";

const router = Router();

export default [router.get("/user/:id", checkToken, AddressController.getUserAdress)];
