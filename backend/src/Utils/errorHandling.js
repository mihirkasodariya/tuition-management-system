// utils/errorHandler.js
const httpErrors = require("http-errors");
const { isCelebrateError } = require("celebrate");
const multer = require("multer");

class ErrorHandler {
  multerCodes = {
    LIMIT_FILE_SIZE: {
      status: 400,
      message: "File size is too large. Maximum file size allowed is 2MB",
    },
    LIMIT_UNEXPECTED_FILE: {
      status: 400,
      message: "Unexpected file field name",
    },
    EXPECT_IMAGE_ONLY: {
      status: 400,
      message: "Only images are allowed",
    },
  };

  handleCustomErrorService(error, next) {
    let httpError;
    if (error instanceof httpErrors.HttpError) {
      httpError = error;
    } else if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      httpError = httpErrors.ServiceUnavailable(
        "Service temporarily unavailable. Please try again later"
      );
    } else if (error.name === "ValidationError") {
      httpError = httpErrors.BadRequest(error.message);
    } else if (error.name === "GoogleRefreshTokenExpiredError") {
      httpError = httpErrors.Unauthorized(
        "Google token is missing or invalid. Please connect your Google account."
      );
    } else {
      httpError = httpErrors.InternalServerError(error.message);
    }

    next(httpError);
  }

  handleMainErrorService(err, res) {
    if (isCelebrateError(err)) {
      // Extract Joi validation errors
      const validationError = {};
      for (const [key, value] of err.details.entries()) {
        validationError[key] = value.details.map((detail) => detail.message);
      }

      // Get the first error message (across all validation segments)
      const firstErrorMessage = Object.values(validationError)
        .flat() // Flatten to merge all arrays
        .shift(); // Get the first error message

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: firstErrorMessage || "Validation error", // Show only the first error
        details: validationError, // Still include all errors for debugging
      });
    } else if (err instanceof multer.MulterError) {
      let multerMessage = this.multerCodes[err.code]
        ? this.multerCodes[err.code].message
        : null;
      let multerStatus = this.multerCodes[err.code]
        ? this.multerCodes[err.code].status
        : null;
      res.status(err.status || 500).json({
        success: false,
        statusCode: multerStatus || 500,
        message: multerMessage || err.message,
        multerError: err,
      });
    } else {
      res.status(err.status || 500).json({
        success: false,
        statusCode: err.status || 500,
        message: err.message || "internal server error",
        errorType: err.name,
        stack: err.stack || "not present",
      });
    }
  }
}

module.exports = new ErrorHandler();
