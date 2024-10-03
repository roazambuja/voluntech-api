import { Router } from "express";
import checkToken from "../middlewares/token";
import SearchController from "../controllers/searchController";

const router = Router();

export default [router.get("/", checkToken, SearchController.searchAll)];
