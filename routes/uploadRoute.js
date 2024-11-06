import express from "express";
import { upload } from "../config/multer.js";
import { uploadCreatePost, uploadGet } from "../controllers/file.controller.js";

const router = express.Router();

router.get("/upload", uploadGet).post("/upload", upload.single("file"), uploadCreatePost);

router.get("/:id/upload", uploadGet).post("/:id/upload", upload.single("file"), uploadCreatePost);

export default router;
