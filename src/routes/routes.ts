import { IRouter, Router } from "express";
import userRouter from "./userRouter";
import authRoutes from "./authRoutes";
import addressRoutes from "./addressRoutes";
import projectRoutes from "./projectRoutes";

const router: IRouter = Router();

router.use("/users", userRouter);
router.use("/login", authRoutes);
router.use("/address", addressRoutes);
router.use("/projects", projectRoutes);

export default router;
