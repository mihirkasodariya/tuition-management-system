const mongoose = require("mongoose");
const httpErrors = require("http-errors");
const logger = require("../Config/logger.config");

const ValidateObjectId = (key) => {
  return (req, res, next) => {
    const id = req.params[key];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      logger.error("Middlewares- validateObjectid-ValidateObjectId-Error", id);
      return next(httpErrors.BadRequest("Invalid MongoDb Object Id"));
    }

    next();
  };
};

module.exports = ValidateObjectId;
