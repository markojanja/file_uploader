import express from "express";

import {
  logout,
  signinGet,
  signinPost,
  signupGet,
  signupPost,
} from "../controllers/auth.controller.js";
import { validateSignin, validateSignUp } from "../validators/validate.js";
import { redirectIfAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/auth/signin");
});

router.get("/signup", redirectIfAuth, signupGet).post("/signup", validateSignUp, signupPost);
router.get("/signin", redirectIfAuth, signinGet).post("/signin", validateSignin, signinPost);
router.get("/logout", logout);

export default router;
