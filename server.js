import express from "express";
import path from "path";
import url from "url";
import session from "express-session";
import passport from "./config/passport.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db/prisma.js";
import AuthRoute from "./routes/authRoute.js";
import DashRoute from "./routes/dashRoute.js";
import SharedRoute from "./routes/sharedRoute.js";
import SharePublicRoute from "./routes/sharedPublicRoute.js";
import { isAuth, redirectIfAuth } from "./middleware/auth.middleware.js";
import getUser from "./middleware/getUser.middlware.js";
import errorHandler from "./middleware/errorHandler.js";
import { disableCache } from "./middleware/disableCache.js";

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
      httpOnly: true, // Ensures that the cookie is only accessible by the server
      secure: process.env.NODE_ENV === "production", // Use 'secure' flag for HTTPS in production
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

app.use(getUser);

app.get("/", redirectIfAuth, (req, res) => {
  res.status(200).render("home");
});

app.use("/auth", AuthRoute);

app.use("/dashboard", isAuth, disableCache, DashRoute);

app.use("/", SharedRoute);

app.use("/shared", SharePublicRoute);

app.use(errorHandler);

app.all("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
