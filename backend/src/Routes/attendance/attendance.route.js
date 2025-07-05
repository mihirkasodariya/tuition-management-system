const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN } = require("../../Constants/roles.constants");
const {
  createNewLiveClassController,
  getAttendanceListController,
  getAttendanceByDateController,
  updateAttendanceDetailsController,
  createCronJobHandlerController,
} = require("../../Controllers/attendance/attendance.controller");
const {
  currentBatchDetailMiddleWare,
} = require("../../Middlewares/batch.middleware");
const {
  getAttendanceDateWiseValidation,
  getAttendanceListValidation,
  updateAttendanceDetailsValidation,
} = require("../../validators/attendance/attendance.joi");

const AttendanceRoutes = express.Router();

AttendanceRoutes.route("/:studentId/new-live-class").post(
  Authentication,
  Authorization(ADMIN),
  currentBatchDetailMiddleWare,
  createNewLiveClassController
);

AttendanceRoutes.route("/:studentId/attendances").get(
  Authentication,
  Authorization(ADMIN),
  currentBatchDetailMiddleWare,
  getAttendanceListValidation,
  getAttendanceListController
);

AttendanceRoutes.route("/admin/date-wise").get(
  Authentication,
  Authorization(ADMIN),
  getAttendanceDateWiseValidation,
  getAttendanceByDateController
);

AttendanceRoutes.route("/admin/:attendanceId").put(
  Authentication,
  Authorization(ADMIN),
  updateAttendanceDetailsValidation,
  updateAttendanceDetailsController
);

// cron job route
AttendanceRoutes.route("/cron-job").get(createCronJobHandlerController);

module.exports = AttendanceRoutes;
