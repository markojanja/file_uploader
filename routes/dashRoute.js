import express from "express";
import { dashboardGet } from "../controllers/dash.controller.js";
import folderRoute from "../routes/folderRoute.js";
import { folderCreate } from "../controllers/folder.controller.js";

const router = express.Router();

router.get("/", dashboardGet);

router
  .get("/create", async (req, res) => {
    res.render("create-form", { parentId: null });
  })
  .post("/create", folderCreate);

router.use("/", folderRoute);

export default router;
