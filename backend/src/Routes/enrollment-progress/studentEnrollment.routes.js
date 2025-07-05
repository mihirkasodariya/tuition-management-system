const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { STUDENT } = require("../../Constants/roles.constants");
const {
  getMyAllEnrollmentsController,
} = require("../../Controllers/enrollment-progress/studentEnrollments.controller");

const StudentEnrollmentRoutes = express.Router();

StudentEnrollmentRoutes.route("/my-enrollments").get(
  Authentication,
  Authorization(STUDENT),
  getMyAllEnrollmentsController
);

module.exports = StudentEnrollmentRoutes;
