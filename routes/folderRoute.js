import express from "express";
import {
  folderCreate,
  folderCreateGet,
  folderDeletePost,
  folderEdit,
  folderEditPost,
  folderGet,
} from "../controllers/folder.controller.js";
import prisma from "../db/prisma.js";

const router = express.Router();

router.get("/create", folderCreateGet).post("/create", folderCreate);

router.get("/:id", folderGet);

router.get("/:id/create", folderCreateGet).post("/:id/create", folderCreate);

router.get("/:id/edit", folderEdit).post("/:id/edit", folderEditPost);

router.get("/:id/remove", folderDeletePost);

router.post("/is-shared", async (req, res, next) => {
  const { id } = req.body;
  console.log(id);
  try {
    const file = await prisma.sharedFile.findFirst({
      where: {
        fileId: id.trim(), // Use the foreign key field explicitly.
      },
    });
    console.log(file);
    if (file) {
      return res.status(200).json({ shared: true });
    } else {
      return res.status(200).json({ shared: false });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
