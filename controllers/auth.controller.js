import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";
import { validationResult } from "express-validator";
import passport from "../config/passport.js";

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

export const signinGet = (req, res) => {
  res.status(200).render("sign-in");
};

export const signinPost = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    return res.status(400).render("sign-in", { errors: errors.array() });
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render("sign-in", { errors: [{ msg: info.message }] });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/dashboard");
    });
  })(req, res, next);
};

export const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
