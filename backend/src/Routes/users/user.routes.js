const express = require("express");
const {
  RegisterStudentController,
  LoginUserController,
  MyProfileController,
  GetStudentsController,
  singleStudentDetailsController,
  updateStudentDetailController,
  updatePasswordController,
} = require("../../Controllers/users/user.controller");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const {
  RegisterStudentValidation,
  LoginUserValidation,
  getStudentsValidation,
  updateStudentValidation,
  updatePasswordValidation,
} = require("../../validators/users/user.joi");
const { ADMIN } = require("../../Constants/roles.constants");

const UserRoutes = express.Router();

UserRoutes.route("/login").post(LoginUserValidation, LoginUserController);
UserRoutes.route("/register").post(
  Authentication,
  Authorization(ADMIN),
  RegisterStudentValidation,
  RegisterStudentController
);

UserRoutes.route("/profile").get(Authentication, MyProfileController);

UserRoutes.route("/profile/update-password").put(
  Authentication,
  updatePasswordValidation,
  updatePasswordController
);

// students routes
UserRoutes.route("/students").get(
  Authentication,
  Authorization(ADMIN),
  getStudentsValidation,
  GetStudentsController
);

UserRoutes.route("/students/:studentId")
  .get(Authentication, Authorization(ADMIN), singleStudentDetailsController)
  .put(
    Authentication,
    Authorization(ADMIN),
    updateStudentValidation,
    updateStudentDetailController
  );

module.exports = UserRoutes;
