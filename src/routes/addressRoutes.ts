import { Router } from "express";
import AddressController from "../controllers/addressController";

const router = Router();

export default [router.get("/user/:id", AddressController.getUserAdress)];
