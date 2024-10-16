import { Router } from "express";
import checkToken from "../middlewares/token";
import PostController from "../controllers/postController";
import { upload } from "../middlewares/upload";

const router = Router();

export default [
  router.post("/", upload.array("pictures"), checkToken, PostController.createPost),
  router.get("/user/:id", checkToken, PostController.getUserPosts),
];
