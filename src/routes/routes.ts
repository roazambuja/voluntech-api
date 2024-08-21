import { IRouter, Router } from "express";
import userRouter from "./userRouter";
import authRoutes from "./authRoutes";
import addressRoutes from "./addressRoutes";

const router: IRouter = Router();

router.use("/users", userRouter);
router.use("/login", authRoutes);
router.use("/address", addressRoutes);

export default router;
