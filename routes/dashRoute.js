import express from "express";
import prisma from "../db/prisma.js";
import { sortFilesAndFolders } from "../utils/utils.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        folders: {
          orderBy: {
            createdAt: "asc",
          },
        },
        files: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const data = [...user.folders, ...user.files];
    const sorted = sortFilesAndFolders(data, "dsc");
    res.render("dash", { data: sorted });
  } catch (error) {
    console.log(error);
  }
});

router
  .get("/create", async (req, res) => {
    res.render("create-form");
  })
  .post("/create", async (req, res) => {
    const { folderName } = req.body;
    try {
      await prisma.folder.create({
        data: {
          ownerId: req.user.id,
          name: folderName,
        },
      });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  });

export default router;
