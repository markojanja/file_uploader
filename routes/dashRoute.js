import express from "express";
import prisma from "../db/prisma.js";
import { dashboardGet } from "../controllers/dash.controller.js";

const router = express.Router();

router.get("/", dashboardGet);

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
