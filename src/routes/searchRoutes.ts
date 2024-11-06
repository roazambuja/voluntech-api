import { Router } from "express";
import SearchController from "../controllers/searchController";

const router = Router();

export default [router.get("/", SearchController.searchAll)];
