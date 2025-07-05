const httpErrors = require("http-errors");
const logger = require("../Config/logger.config");
const errorHandling = require("../Utils/errorHandling");
const batchModel = require("../Schema/batches/batch.model");

const currentBatchDetailMiddleWare = async (req, res, next) => {
  try {
    logger.info(
      "MiddleWares - batch.middleware  - getCurrentBatchDetails - Start"
    );

    let currentBatch = await batchModel.findOne({ isActive: true }).lean();

    if (!currentBatch) {
      return next(httpErrors.NotFound("Batch Not Found"));
    }

    currentBatch._id = currentBatch._id.toString();

    req.batch = currentBatch;
    logger.info(
      "MiddleWares - batch.middleware  - getCurrentBatchDetails - End"
    );
    next();
  } catch (error) {
    logger.error(
      "MiddleWares - batch.middleware  - getCurrentBatchDetails - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  currentBatchDetailMiddleWare,
};
