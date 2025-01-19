import express from "express";
import { dashboardGet } from "../controllers/dash.controller.js";
import folderRoute from "../routes/folderRoute.js";
import fileRoute from "../routes/fileRoute.js";
import { disableCache } from "../middleware/disableCache.js";

const router = express.Router();

router.get("/", disableCache, dashboardGet);

router.use("/", disableCache, fileRoute);

router.use("/", disableCache, folderRoute);

export default router;
