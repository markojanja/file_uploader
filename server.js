import express from "express";
import path from "path";
import url from "url";
import session from "express-session";
import passport from "./config/passport.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db/prisma.js";
import AuthRoute from "./routes/authRoute.js";
import DashRoute from "./routes/dashRoute.js";
import { isAuth } from "./middleware/auth.middleware.js";
import getUser from "./middleware/getUser.middlware.js";

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

app.use(getUser);

app.get("/", (req, res) => {
  res.status(200).render("home");
});

app.use("/auth", AuthRoute);

app.use("/dashboard", isAuth, DashRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
