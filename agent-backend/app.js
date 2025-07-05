const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const MongoDataBaseConn = require("./src/Config/db.config");
const IndexRoutes = require("./src/Routes/index.route");
const { ratelimitConfig } = require("./src/Config/ratelimit.config");
const errorHandling = require("./src/Utils/errorHandling");
const corsConfig = require("./src/Config/cors.config");
const app = express();
app.use(
  helmet({
    xPoweredBy: false,
  })
);

//----------------------------------------
//------------ config --------------------
//----------------------------------------
// MongoDataBaseConn
MongoDataBaseConn();
app.use(ratelimitConfig);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsConfig));

//----------------------------------------
//--------------- Routes -----------------
//----------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Message",
  });
});

app.get("/health", (req, res) => {
  let headers = req.headers;
  res.status(200).json({
    success: true,
    message: "Hello from AcademIQ V1 agent api",
    headers,
  });
});

// Routes
app.use("/api/v1", IndexRoutes);

//----------------------------------------
//--------------- others -----------------
//----------------------------------------
// if no routes findout is in express 5th version
app.use("", (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    url: req.originalUrl,
    type: req.method,
    message: "API not found",
  });
});

// // response for error message
app.use((err, req, res, next) => {
  errorHandling.handleMainErrorService(err, res);
});

module.exports = app;
