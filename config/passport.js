import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!user) {
        return done(null, false, { message: "Invalid credentials" });
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Invalid credentials" });
      }

      return done(null, user);
    } catch (error) {
      console.log(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    }); //find user
    done(null, user);
  } catch (error) {
    console.log(error);
  }
});

export default passport;
