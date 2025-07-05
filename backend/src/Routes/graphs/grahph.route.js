const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");

const { ADMIN, STUDENT } = require("../../Constants/roles.constants");
const {
  adminDashboardGraphController,
} = require("../../Controllers/graphs/admin.controller");
const {
  currentBatchDetailMiddleWare,
} = require("../../Middlewares/batch.middleware");
const {
  studentDashboardGraphController,
} = require("../../Controllers/graphs/student.controller");

const GraphRoutes = express.Router();

GraphRoutes.route("/admin/dashboard").get(
  Authentication,
  Authorization(ADMIN),
  adminDashboardGraphController
);

GraphRoutes.route("/student/dashboard").get(
  Authentication,
  Authorization(ADMIN, STUDENT),
  currentBatchDetailMiddleWare,
  studentDashboardGraphController
);

module.exports = GraphRoutes;
