import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";
import { validationResult } from "express-validator";

export const signupGet = (req, res) => {
  res.status(200).render("sign-up");
};

export const signupPost = async (req, res) => {
  const { username, password } = req.body;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
