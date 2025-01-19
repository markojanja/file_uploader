import express from "express";
import { sharePublic } from "../controllers/shared.controller.js";
import { downloadFile } from "../controllers/shared.controller.js";

const router = express.Router();

router.get("/:fileId", sharePublic);

router.get("/:fileId/download", downloadFile);

export default router;
