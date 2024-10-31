import express from "express";

import { signupGet, signupPost } from "../controllers/auth.controller.js";
import { validateSignUp } from "../validators/validate.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/auth/signup");
});

router.get("/signup", signupGet).post("/signup", validateSignUp, signupPost);

export default router;
