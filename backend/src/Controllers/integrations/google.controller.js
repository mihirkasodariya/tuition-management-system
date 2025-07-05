const GoogleAuthServiceClass = require("../../Services/google.auth.service");
const GoogleCalendarServiceClass = require("../../Services/google.calendar.service");
const errorHandling = require("../../Utils/errorHandling");
const userModel = require("../../Schema/users/user.model");
const axios = require("axios");
const logger = require("../../Config/logger.config");
const { DEVELOPMENT_MODE } = require("../../Config/index.config");

// connectToGoogleController
const connectToGoogleController = async (req, res, next) => {
  try {
    logger.info(
      "Integration - google.controller - connectToGoogleController - start"
    );

    const googleAuthService = new GoogleAuthServiceClass(
      req.user._id.toString()
    );
    const authUrl = googleAuthService.generateAuthUrl();
    logger.info(
      "Integration - google.controller - connectToGoogleController - end"
    );
    res.status(200).json({ success: true, statusCode: 200, authUrl });
  } catch (error) {
    logger.error(
      "Integration - google.controller - connectToGoogleController - error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const googleAuthCallbackController = async (req, res, next) => {
  try {
    logger.info(
      "Integration - google.controller - googleAuthCallbackController - start"
    );
    const { code, state } = req.query;

    if (!code || !state) {
      throw new Error("Authorization code or state not provided");
    }

    const googleAuthService = new GoogleAuthServiceClass(state);
    const { tokens, userDetails } = await googleAuthService.getTokensFromCode(
      code
    );

    logger.info(
      "Integration - google.controller - googleAuthCallbackController - end"
    );

    let baseURL =
      DEVELOPMENT_MODE === "development"
        ? "http://localhost:5173"
        : "https://www.AcademIQtutorial.com";

    baseURL += "/settings/admin-integrations";

    res.redirect(baseURL);

    // res.status(200).json({
    //   success: true,
    //   message: "Google authentication successful",
    //   tokens,
    //   userDetails,
    // });
  } catch (error) {
    logger.error(
      "Integration - google.controller - googleAuthCallbackController - error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getGoogleProfileDetailsController = async (req, res, next) => {
  try {
    logger.info(
      "Integration - google.controller - getGoogleProfileDetailsController - start"
    );
    const userID = req.user._id;
    const needProfileDetails = req.query?.profile || false;

    const googleAuthService = await new GoogleAuthServiceClass(
      userID.toString()
    );
    await googleAuthService.initializeAuth();
    const userInfo = await googleAuthService.getUserInfo();

    let data = {
      isGoogleConnected: true,
    };
    logger.info(
      "Integration - google.controller - getGoogleProfileDetailsController - end"
    );

    if (needProfileDetails && userInfo) {
      data.userInfo = userInfo;
    }
    res.status(200).json({
      success: true,
      message: "Google ProfileDetails retrieved successfully",
      data,
    });
  } catch (error) {
    logger.error(
      "Integration - google.controller - getGoogleProfileDetailsController - error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const disConnectToGoogleController = async (req, res, next) => {
  try {
    logger.info(
      "Integration - google.controller - disConnectToGoogleController - start"
    );
    const userID = req.user._id;
    const token = req.user.google.tokens.access_token;
    const response = await axios.post(
      "https://oauth2.googleapis.com/revoke",
      `token=${token}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.status === 200) {
      // Successfully revoked the token
      await userModel.findByIdAndUpdate(userID, {
        $set: {
          "google.isConnected": false,
          "google.tokens": null,
          "google.profileDetails": null,
        },
      });

      logger.info(
        "Integration - google.controller - disConnectToGoogleController - end"
      );

      res.status(200).json({
        success: true,
        message: "Google account disconnected successfully",
      });
    } else {
      // Handle error response from Google
      res.status(400).json({
        success: false,
        message: "Failed to disconnect Google account",
        error: response.data,
      });
    }
  } catch (error) {
    logger.error(
      "Integration - google.controller - disConnectToGoogleController - error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  connectToGoogleController,
  googleAuthCallbackController,
  getGoogleProfileDetailsController,
  disConnectToGoogleController,
};
