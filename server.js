import express from "express";
import path from "path";
import url from "url";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).render("home");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
