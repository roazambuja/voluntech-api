import { IRouter, Router } from "express";
import userRouter from "./userRouter";
import authRoutes from "./authRoutes";

const router: IRouter = Router();

router.use("/users", userRouter);
router.use("/login", authRoutes);

export default router;
