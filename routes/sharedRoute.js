import express from "express";
import { shared } from "../controllers/shared.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/shared", isAuth, shared);

export default router;
