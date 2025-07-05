const { google } = require("googleapis");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = require("../Config/index.config.js");
const userModel = require("../Schema/users/user.model.js");
const logger = require("../Config/logger.config.js");
const scopes = ["email", "profile", "https://www.googleapis.com/auth/calendar"];

class GoogleAuthServiceClass {
  constructor(userID) {
    this.oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );
    this.userID = userID || null;
  }

  // user related methods
  setUserID(userID) {
    this.userID = userID;
  }
  getUserID() {
    return this.userID;
  }

  // OAuth2 related methods
  generateAuthUrl() {
    logger.info(
      "Services - Google.auth.service - GoogleAuthServiceClass - generateAuthUrl "
    );

    return this.oAuth2Client.generateAuthUrl({
      access_type: "offline", // Ensures refresh_token is returned on first consent
      prompt: "consent", // Always show the consent screen
      scope: scopes,
      state: this.userID, // Pass userID in state to retrieve it later
    });
  }

  async getTokensFromCode(code) {
    try {
      logger.info(
        "Services - Google.auth.service - GoogleAuthServiceClass - getTokensFromCode - start"
      );
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);
      let userDetails = null;

      let { isConnected } = await this.getTokensFromDatabase();

      // Store tokens in database
      if (this.userID && isConnected) {
        userDetails = await this.saveTokensToDatabase(tokens);
      } else if (this.userID && !isConnected) {
        let profileDetails = await this.getUserInfo();
        profileDetails = {
          resourceName: profileDetails.resourceName,
          etag: profileDetails.etag,
          name: profileDetails.names[0],
          emailAddresses: profileDetails.emailAddresses[0],
          photo: profileDetails.photos[0],
        };
        userDetails = await this.saveUserToDatabase(tokens, profileDetails);
      }
      logger.info(
        "Services - Google.auth.service - GoogleAuthServiceClass - getTokensFromCode - end"
      );
      return { tokens, userDetails };
    } catch (error) {
      logger.error(
        "Services - Google.auth.service - GoogleAuthServiceClass - getTokensFromCode - error",
        error
      );
      throw error;
    }
  }

  setCredentials(tokens) {
    this.oAuth2Client.setCredentials(tokens);
  }

  getAuthClient() {
    return this.oAuth2Client;
  }

  async initializeAuth() {
    logger.info(
      "Services - Google.auth.service - GoogleAuthServiceClass - initializeAuth"
    );
    try {
      const { tokens } = await this.getTokensFromDatabase();

      if (tokens === null) {
        const googleRefreshTokenExpiryError = new Error(
          "REFRESH_TOKEN_EXPIRED"
        );
        googleRefreshTokenExpiryError.name = "GoogleRefreshTokenExpiredError";
        throw googleRefreshTokenExpiryError;
      }
      this.setCredentials(tokens);
      // Check if access token is expired
      const isTokenExpired = this.oAuth2Client.isTokenExpiring();

      if (isTokenExpired) {
        try {
          // Try to refresh the token
          const { credentials } = await this.oAuth2Client.refreshAccessToken();

          // Save new tokens to database
          await this.saveTokensToDatabase(credentials);

          return credentials.access_token;
        } catch (refreshError) {
          // Handle refresh token expiration
          if (
            refreshError.message.includes("invalid_grant") ||
            refreshError.message.includes("refresh token expired")
          ) {
            // Refresh token is expired - user needs to re-authenticate
            const googleRefreshTokenExpiryError = new Error(
              "REFRESH_TOKEN_EXPIRED"
            );
            googleRefreshTokenExpiryError.name =
              "GoogleRefreshTokenExpiredError";

            await userModel.findByIdAndUpdate(this.userID, {
              $set: {
                google: {
                  isConnected: false,
                  tokens: null,
                  profileDetails: null,
                },
              },
            });
            throw googleRefreshTokenExpiryError;
          }
          throw refreshError;
        }
      }
    } catch (error) {
      logger.error(
        "Services - Google.auth.service - GoogleAuthServiceClass - initializeAuth - error",
        error
      );
      throw error;
    }
  }

  async getUserInfo() {
    let peopleApi = google.people({
      version: "v1",
      auth: this.oAuth2Client,
    });

    let details = await peopleApi.people.get({
      resourceName: "people/me",
      personFields: "names,emailAddresses,photos",
    });
    return details.data;
  }

  // for db related write
  async saveTokensToDatabase(tokens) {
    try {
      logger.info(
        "Services - Google.auth.service - GoogleAuthServiceClass - saveTokensToDatabase - start"
      );
      let response = await userModel
        .findByIdAndUpdate(
          this.userID,
          { "google.tokens": tokens },
          { new: true, upsert: true }
        )
        .lean();

      if (!response) {
        throw new Error("Failed to save tokens to database.");
      }

      return response;
    } catch (error) {
      logger.error(
        "Services - Google.auth.service - GoogleAuthServiceClass - saveTokensToDatabase - error",
        error
      );
      throw error;
    }
  }

  async saveUserToDatabase(tokens, profileDetails) {
    try {
      logger.info(
        "Services - Google.auth.service - GoogleAuthServiceClass - saveUserToDatabase - start"
      );
      let details = {
        google: {
          isConnected: true,
          profileDetails,
          tokens,
        },
      };
      let response = await userModel
        .findByIdAndUpdate(this.userID, details, { new: true, upsert: true })
        .lean();

      if (!response) {
        throw new Error("Failed to save tokens to database.");
      }

      return response;
    } catch (error) {
      logger.error(
        "Services - Google.auth.service - GoogleAuthServiceClass - saveUserToDatabase - error",
        error
      );
      throw error;
    }
  }

  async getTokensFromDatabase() {
    try {
      logger.info(
        "Services - Google.auth.service - GoogleAuthServiceClass - getTokensFromDatabase - start"
      );
      const user = await userModel
        .findById(this.userID)
        .select("google")
        .lean();
      if (!user) {
        throw new Error("No tokens found for this user.");
      }

      logger.info(
        "Services - Google.auth.service - GoogleAuthServiceClass - getTokensFromDatabase - end"
      );
      return user?.google || {};
    } catch (error) {
      logger.error(
        "Services - Google.auth.service - GoogleAuthServiceClass - getTokensFromDatabase - error",
        error
      );
      throw error;
    }
  }

  async getValidAccessToken() {
    try {
      // Get current tokens from database
      const { tokens } = await this.getTokensFromDatabase();

      // Set credentials
      this.setCredentials(tokens);

      // Check if access token is expired
      const isTokenExpired = this.oAuth2Client.isTokenExpiring();

      if (isTokenExpired) {
        try {
          // Try to refresh the token
          const { credentials } = await this.oAuth2Client.refreshAccessToken();

          // Save new tokens to database
          await this.saveTokensToDatabase(credentials);

          return credentials.access_token;
        } catch (refreshError) {
          // Handle refresh token expiration
          if (
            refreshError.message.includes("invalid_grant") ||
            refreshError.message.includes("refresh token expired")
          ) {
            // Refresh token is expired - user needs to re-authenticate
            const googleRefreshTokenExpiryError = new Error(
              "REFRESH_TOKEN_EXPIRED"
            );
            googleRefreshTokenExpiryError.name =
              "GoogleRefreshTokenExpiredError";
            throw googleRefreshTokenExpiryError;
          }
          throw refreshError;
        }
      }

      return { tokens };
    } catch (error) {
      if (error.message === "REFRESH_TOKEN_EXPIRED") {
        throw error; // Propagate this specific error
      }
      console.error("Error getting valid access token:", error);
      throw new Error("Failed to get valid access token");
    }
  }

  // Helper method to check if we need to prompt user to re-authenticate
  async requiresReAuthentication() {
    try {
      await this.getValidAccessToken();
      return false;
    } catch (error) {
      return error.message === "REFRESH_TOKEN_EXPIRED";
    }
  }
}

module.exports = GoogleAuthServiceClass;
