import { IRouter, Router } from "express";
import userRouter from "./userRouter";
import authRoutes from "./authRoutes";
import addressRoutes from "./addressRoutes";
import projectRoutes from "./projectRoutes";
import pixRoutes from "./pixRoutes";
import socialMediaRoutes from "./socialMediaRoutes";
import volunteeringRoutes from "./volunteeringRoutes";
import searchRoutes from "./searchRoutes";
import followRoutes from "./followRoutes";
import updatesRoutes from "./updatesRoutes";
import participationRoutes from "./participationRoutes";

const router: IRouter = Router();

router.use("/users", userRouter);
router.use("/login", authRoutes);
router.use("/address", addressRoutes);
router.use("/projects", projectRoutes);
router.use("/pix", pixRoutes);
router.use("/social-media", socialMediaRoutes);
router.use("/volunteering", volunteeringRoutes);
router.use("/search", searchRoutes);
router.use("/follow", followRoutes);
router.use("/updates", updatesRoutes);
router.use("/participation", participationRoutes);

export default router;
