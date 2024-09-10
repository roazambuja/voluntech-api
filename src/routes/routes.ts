import { IRouter, Router } from "express";
import userRouter from "./userRouter";
import authRoutes from "./authRoutes";
import addressRoutes from "./addressRoutes";
import projectRoutes from "./projectRoutes";
import pixRoutes from "./pixRoutes";

const router: IRouter = Router();

router.use("/users", userRouter);
router.use("/login", authRoutes);
router.use("/address", addressRoutes);
router.use("/projects", projectRoutes);
router.use("/pix", pixRoutes);

export default router;
