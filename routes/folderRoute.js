import express from "express";
import {
  folderCreate,
  folderCreateGet,
  folderDeletePost,
  folderEdit,
  folderEditPost,
  folderGet,
} from "../controllers/folder.controller.js";

const router = express.Router();

router.get("/create", folderCreateGet).post("/create", folderCreate);

router.get("/:id", folderGet);

router.get("/:id/create", folderCreateGet).post("/:id/create", folderCreate);

router.get("/:id/edit", folderEdit).post("/:id/edit", folderEditPost);

router.get("/:id/delete", folderDeletePost);

export default router;
