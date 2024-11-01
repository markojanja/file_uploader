import express from "express";

import { signinGet, signinPost, signupGet, signupPost } from "../controllers/auth.controller.js";
import { validateSignin, validateSignUp } from "../validators/validate.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/auth/signin");
});

router.get("/signup", signupGet).post("/signup", validateSignUp, signupPost);
router.get("/signin", signinGet).post("/signin", validateSignin, signinPost);

export default router;
