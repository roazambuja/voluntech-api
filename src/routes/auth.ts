import { IRouter, Router } from "express";
import usersRouter from "./usersRouter";

const router: IRouter = Router();

router.use("/users", usersRouter);

export default router;
