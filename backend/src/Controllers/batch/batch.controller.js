const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const batchModel = require("../../Schema/batches/batch.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");

const createNewBatchController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - batch - batch.controller - createNewBatchController - Start"
    );

    let { name, startDate, endDate } = req.body;
    let details = {
      name,
      startDate,
      endDate,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };
    const existingBatch = await batchModel.findOne({
      name: name.toLowerCase(),
    });
    if (existingBatch) {
      return next(
        httpErrors.BadRequest("batch with the same name already exists.")
      );
    }

    const data = new batchModel(details);
    await data.save();

    logger.info(
      "Controllers - batch - batch.controller - createNewBatchController  - End"
    );
    res.status(201).send({
      success: true,
      statusCode: 201,
      message: "Batch successfully created.",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - batch - batch.controller - createNewBatchController  - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getBatchesListController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - batch - batch.controller - getBatchesListController - Start"
    );

    const { sort } = req.query;

    let sortQuery = sortConstants["-createdAt"];
    if (sort) {
      sortQuery = sortConstants[sort];
    }

    const boardData = await batchModel
      .find()
      .populate("createdBy updatedBy", "name")
      .sort(sortQuery)
      .lean();

    logger.info(
      "Controllers -  batch - batch.controller - getBatchesListController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Boards list retrieved successfully.",
      data: boardData,
    });
  } catch (error) {
    logger.error(
      "Controllers - batch - batch.controller - getBatchesListController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createNewBatchController,
  getBatchesListController,
};
