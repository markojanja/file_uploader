import express from "express";
import { folderCreate, folderGet } from "../controllers/folder.controller.js";

const router = express.Router();

router.get("/:id", folderGet);

router
  .get("/:id/create", (req, res) => {
    res.render("create-form", { parentId: req.params.id });
  })
  .post("/:id/create", folderCreate);

export default router;
