const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN } = require("../../Constants/roles.constants");
const {
  createStudentHomeworkController,
  getSingleHomeworkController,
  getHomeworkListController,
  assignHomeworkRatingController,
  updateHomeworkController,
  deleteHomeworkController,
} = require("../../Controllers/homework/homework.controller");
const {
  createStudentHomeworkValidation,
  getHomeworkListValidation,
  assignHomeworkRatingValidation,
  updateHomeworkValidation,
} = require("../../validators/homework/homework.joi");
const {
  currentBatchDetailMiddleWare,
} = require("../../Middlewares/batch.middleware");

const HomeworkRoutes = express.Router();

HomeworkRoutes.route("/assign-new-homework/:studentId").post(
  Authentication,
  Authorization(ADMIN),
  currentBatchDetailMiddleWare,
  createStudentHomeworkValidation,
  createStudentHomeworkController
);

HomeworkRoutes.route("/homework-list").get(
  Authentication,
  Authorization(ADMIN),
  getHomeworkListValidation,
  getHomeworkListController
);

HomeworkRoutes.route("/:homeworkId")
  .get(Authentication, Authorization(ADMIN), getSingleHomeworkController)
  .put(
    Authentication,
    Authorization(ADMIN),
    updateHomeworkValidation,
    updateHomeworkController
  )
  .delete(Authentication, Authorization(ADMIN), deleteHomeworkController);

HomeworkRoutes.route("/assign-rating/:homeworkId").patch(
  Authentication,
  Authorization(ADMIN),
  assignHomeworkRatingValidation,
  assignHomeworkRatingController
);

module.exports = HomeworkRoutes;
