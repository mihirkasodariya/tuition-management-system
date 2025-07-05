const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { STUDENT } = require("../../Constants/roles.constants");
const {
  currentBatchDetailMiddleWare,
} = require("../../Middlewares/batch.middleware");
const {
  getAttendanceListValidation,
} = require("../../validators/attendance/attendance.joi");
const {
  getStudentAttendanceListController,
} = require("../../Controllers/attendance/studentAttendance.controller");

const StudentAttendanceRoutes = express.Router();

StudentAttendanceRoutes.route("/attendances").get(
  Authentication,
  Authorization(STUDENT),
  currentBatchDetailMiddleWare,
  getAttendanceListValidation,
  getStudentAttendanceListController
);

module.exports = StudentAttendanceRoutes;
