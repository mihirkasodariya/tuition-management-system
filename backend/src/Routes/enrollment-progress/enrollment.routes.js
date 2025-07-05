const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");

const { ADMIN } = require("../../Constants/roles.constants");
const {
  addNewEnrollmentValidations,
  updateStudentProgressValidation,
} = require("../../validators/enrollment-progress/enrollment_progress.validation");
const {
  createNewEnrollmentController,
  getAllSingleStudentEnrollmentController,
  updateStudentProgressController,
} = require("../../Controllers/enrollment-progress/Enrollment.controller");

const EnrollmentRoutes = express.Router();

EnrollmentRoutes.route("/new-enrollment").post(
  Authentication,
  Authorization(ADMIN),
  addNewEnrollmentValidations,
  createNewEnrollmentController
);

EnrollmentRoutes.route("/:studentId/enrollments").get(
  Authentication,
  Authorization(ADMIN),
  getAllSingleStudentEnrollmentController
);
EnrollmentRoutes.route("/:enrollmentId/:subjectId").put(
  Authentication,
  Authorization(ADMIN),
  updateStudentProgressValidation,
  updateStudentProgressController
);

module.exports = EnrollmentRoutes;
