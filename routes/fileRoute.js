import express from "express";
import { upload } from "../config/multer.js";
import {
  deleteFile,
  downloadFile,
  uploadCreatePost,
  uploadGet,
} from "../controllers/file.controller.js";

const router = express.Router();

router.get("/upload", uploadGet).post("/upload", upload.single("file"), uploadCreatePost);

router.get("/:id/upload", uploadGet).post("/:id/upload", upload.single("file"), uploadCreatePost);

router.get("/:id/download", downloadFile);

router.get("/:id/delete", deleteFile);

export default router;
