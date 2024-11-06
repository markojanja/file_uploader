import express from "express";
import { folderCreate, folderCreateGet, folderGet } from "../controllers/folder.controller.js";

const router = express.Router();

router.get("/create", folderCreateGet).post("/create", folderCreate);

router.get("/:id", folderGet);

router.get("/:id/create", folderCreateGet).post("/:id/create", folderCreate);

export default router;
