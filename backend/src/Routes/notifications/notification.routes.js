const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN, STUDENT } = require("../../Constants/roles.constants");
const {
  getNotificationsController,
  updateNotificationController,
} = require("../../Controllers/notifcations/notification.controller");
const {
  updateNotificationValidation,
} = require("../../validators/notifications/notification.joi");

const NotificationRoutes = express.Router();

NotificationRoutes.route("/notifications-list").get(
  Authentication,
  Authorization(ADMIN, STUDENT),
  getNotificationsController
);

NotificationRoutes.route("/:notificationId").put(
  Authentication,
  Authorization(ADMIN, STUDENT),
  updateNotificationValidation,
  updateNotificationController
);

module.exports = NotificationRoutes;
