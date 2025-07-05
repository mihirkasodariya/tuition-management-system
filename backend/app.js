const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require("compression");
let moment = require("moment-timezone");
const MongoDataBaseConn = require("./src/Config/db.config");
const { DEVELOPMENT_MODE } = require("./src/Config/index.config");
const ratelimitConfig = require("./src/Config/ratelimit.config");
const corsConfig = require("./src/Config/cors.config");
const morganConfigFunction = require("./src/Config/morgan.config");
const helmetConfig = require("./src/Config/helmet.config");
const IndexRoutes = require("./src/Routes/index.route");
const errorHandling = require("./src/Utils/errorHandling");
const { deleteNotificationCronJob } = require("./src/Config/cron.config");

const app = express();

//----------------------------------------
//------------ config --------------------
//----------------------------------------
// MongoDataBaseConn
MongoDataBaseConn();

if (DEVELOPMENT_MODE === "development") {
  app.use(morganConfigFunction());
} else {
  deleteNotificationCronJob();
}

app.use(helmetConfig);
app.use(ratelimitConfig);
app.use(compression({ level: 6 }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(corsConfig);
moment.tz.setDefault("Asia/Kolkata");

// ! in vercel it wont work as it is a serverless in vercel
// createLiveClassRemindersCronJob();

// Routes
app.use(IndexRoutes);

// response for error message
app.use((err, req, res, next) => {
  errorHandling.handleMainErrorService(err, res);
});

module.exports = app;
