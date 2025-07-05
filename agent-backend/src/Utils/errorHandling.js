// utils/errorHandler.js
const httpErrors = require("http-errors");

class ErrorHandler {
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
      httpError = httpErrors.BadRequest(
        "User needs to re-authenticate with Google"
      );
    } else {
      httpError = httpErrors.InternalServerError(error.message);
    }

    next(httpError);
  }

  handleMainErrorService(err, res) {
    res.status(err.status || 500).json({
      success: false,
      statusCode: err.status || 500,
      message: err.message || "internal server error",
      errorType: err.name,
      stack: err.stack || "not present",
    });
  }
}

module.exports = new ErrorHandler();
