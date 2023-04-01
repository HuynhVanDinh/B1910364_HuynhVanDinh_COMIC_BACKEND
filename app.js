const express = require("express");
const cors = require("cors");
const comicsRouter = require("./app/routes/comic.rote");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Wellcome to comic application.",
  });
});

app.use("/api/comics", comicsRouter);

module.exports = app;
