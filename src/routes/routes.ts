import { IRouter, Router } from "express";
import userRouter from "./userRouter";

const router: IRouter = Router();

router.use("/users", userRouter);

export default router;
