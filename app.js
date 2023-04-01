const express = require("express");
const cors = require("cors");
const comicsRouter = require("./app/routes/comic.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Wellcome to comic application.",
  });
});

app.use("/api/comics", comicsRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
