import { body } from "express-validator";
import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";

export const validateSignUp = [
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage("Username can contain only numbers and letters.")
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters long.")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (user) {
        throw new Error("Username already in use.");
      }
    })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .escape(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .escape(),
];

export const validateSignin = [
  body("username").trim().notEmpty().withMessage("Username is required").escape(),
  body("password").trim().notEmpty().withMessage("Password is required").escape(),
];
