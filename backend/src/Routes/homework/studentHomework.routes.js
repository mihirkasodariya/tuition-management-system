const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { STUDENT } = require("../../Constants/roles.constants");
const {
  getStudentHomeworkListController,
} = require("../../Controllers/homework/studentHomework.controller");
const {
  getStudentHomeworkListValidation,
} = require("../../validators/homework/studentHomework.joi");

const StudentHomeworkRoutes = express.Router();

StudentHomeworkRoutes.route("/my-homeworks").get(
  Authentication,
  Authorization(STUDENT),
  getStudentHomeworkListValidation,
  getStudentHomeworkListController
);

module.exports = StudentHomeworkRoutes;
