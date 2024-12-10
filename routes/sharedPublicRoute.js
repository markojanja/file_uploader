import express from "express";
import { sharePublic } from "../controllers/shared.controller.js";

const router = express.Router();

router.get("/:fileId", sharePublic);

export default router;
