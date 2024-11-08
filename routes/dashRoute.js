import express from "express";
import { dashboardGet } from "../controllers/dash.controller.js";
import folderRoute from "../routes/folderRoute.js";
import fileRoute from "../routes/fileRoute.js";

const router = express.Router();

router.get("/", dashboardGet);

router.use("/", fileRoute);

router.use("/", folderRoute);

export default router;
