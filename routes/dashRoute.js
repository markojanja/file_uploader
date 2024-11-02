import express from "express";
import prisma from "../db/prisma.js";
import { sortFilesAndFolders } from "../utils/utils.js";

const router = express.Router();

router.get("/", async (req, res) => {
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

  console.log(sorted);

  res.render("dash", { data: sorted });
});

router
  .get("/create", async (req, res) => {
    res.render("create-form");
  })
  .post("/create", async (req, res) => {
    const { folderName } = req.body;

    await prisma.folder.create({
      data: {
        ownerId: req.user.id,
        name: folderName,
      },
    });
    res.redirect("/dashboard");
  });

router
  .get("files/create", async (req, res) => {
    res.render("create-form");
  })
  .post("files/create", async (req, res) => {
    const { file } = req.body;

    await prisma.files.create({
      data: {
        ownerId: req.user.id,
        name: folderName,
      },
    });
    res.redirect("/dashboard");
  });

export default router;
