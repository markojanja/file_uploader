import express from "express";
import { dashboardGet } from "../controllers/dash.controller.js";
import folderRoute from "../routes/folderRoute.js";
import uploadRoute from "../routes/uploadRoute.js";

const router = express.Router();

router.get("/", dashboardGet);

router.use("/", uploadRoute);

router.use("/", folderRoute);

export default router;
