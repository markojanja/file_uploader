import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.status(200).send("Home Page");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
