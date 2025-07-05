const express = require("express");
const {
  connectToGoogleController,
  googleAuthCallbackController,
  getGoogleProfileDetailsController,
  disConnectToGoogleController,
} = require("../../Controllers/integrations/google.controller");
const {
  Authentication,
  Authorization,
  setHeaderDevelopment,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN } = require("../../Constants/roles.constants");

const GoogleAuthRoutes = express.Router();

GoogleAuthRoutes.route("/").get(
  // setHeaderDevelopment,
  Authentication,
  Authorization(ADMIN),
  connectToGoogleController
);

GoogleAuthRoutes.route("/callback").get(googleAuthCallbackController);

GoogleAuthRoutes.route("/disconnect").get(
  Authentication,
  Authorization(ADMIN),
  disConnectToGoogleController
);

GoogleAuthRoutes.route("/my-profile").get(
  Authentication,
  Authorization(ADMIN),
  getGoogleProfileDetailsController
);
// GoogleAuthRoutes.route("/google-events-list").get(async (req, res) => {
//   try {
//     const userID = "673e19244f630ca743c7abd0";
//     const googleCalendarService = await new GoogleCalendarServiceClass(userID);
//     await googleCalendarService.initialize();
//     const calendarEvents = await googleCalendarService.listEvents();
//     res.status(200).json({
//       success: true,
//       message: "Google Calendar events retrieved successfully",
//       events: calendarEvents,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error getting events",
//       error: error.message,
//     });
//   }
// });

module.exports = GoogleAuthRoutes;
