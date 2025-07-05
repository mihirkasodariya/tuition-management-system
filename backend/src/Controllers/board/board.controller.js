const httpErrors = require("http-errors");
const BOARD_CONSTANTS = require("../../Constants/board.constants");
const logger = require("../../Config/logger.config");
const boardModel = require("../../Schema/boards/board.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const RedisServiceClass = require("../../Services/redis.service");
const { redisBoardsListKey } = require("../../Constants/redis.constants");

const createNewBoardController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - board - board.controller - createNewBoardController - Start"
    );

    let { name, description } = req.body;
    let details = {
      name,
      description: description ?? "this board is about " + name,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };
    const existingBoard = await boardModel.findOne({
      name: name.toLowerCase(),
    });
    if (existingBoard) {
      return next(httpErrors.BadRequest(BOARD_CONSTANTS.BOARD_ALREADY_EXISTS));
    }

    let data = await boardModel.create(details);
    const redisService = new RedisServiceClass();
    await redisService.deleteRedisKey(redisBoardsListKey);
    data = data.toObject();

    data.createdBy = {
      _id: req.user._id,
      name: req.user.name,
    };
    data.updatedBy = {
      _id: req.user._id,
      name: req.user.name,
    };

    logger.info(
      "Controllers - board - board.controller - createNewBoardController - End"
    );
    res.status(201).send({
      success: true,
      statusCode: 201,
      message: BOARD_CONSTANTS.SUCCESSFULLY_BOARD_CREATED,
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - board - board.controller - createNewBoardController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getSingleBoardDetailController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - board - board.controller - getSingleBoardDetailController - Start"
    );

    const { boardID } = req.params;
    const boardData = await boardModel
      .findById(boardID)
      .populate("createdBy updatedBy", "name")
      .lean();

    if (!boardData) {
      return next(httpErrors.NotFound(BOARD_CONSTANTS.BOARD_NOT_FOUND));
    }

    logger.info(
      "Controllers - board - board.controller - getSingleBoardDetailController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: BOARD_CONSTANTS.SUCCESSFULLY_BOARD_DETAILS_FETCHED,
      data: boardData,
    });
  } catch (error) {
    logger.error(
      "Controllers - board - board.controller - getSingleBoardDetailController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getBoardsListController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - board - board.controller - getSingleBoardDetailController - Start"
    );

    let boardData = null;

    const { sort } = req.query;

    let sortQuery = sortConstants["-createdAt"];
    if (sort) {
      sortQuery = sortConstants[sort];
      boardData = await boardModel
        .find()
        .populate("createdBy updatedBy", "name")
        .sort(sortQuery)
        .lean();
    } else {
      const redisService = new RedisServiceClass();
      let cacheData = await redisService.getRedisJSON(redisBoardsListKey);
      if (cacheData) {
        boardData = cacheData;
      } else {
        boardData = await boardModel
          .find()
          .populate("createdBy updatedBy", "name")
          .sort(sortQuery)
          .lean();
        await redisService.setRedisJSON(redisBoardsListKey, boardData);
      }
    }

    logger.info(
      "Controllers - board - board.controller - getBoardsListController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: BOARD_CONSTANTS.SUCCESSFULLY_BOARD_LIST_FETCHED,
      data: boardData,
    });
  } catch (error) {
    logger.error(
      "Controllers - board - board.controller - getBoardsListController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateBoardController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - board - board.controller - updateBoardController - Start"
    );

    const { boardID } = req.params;
    const { name, description } = req.body;

    let detailsToUpdate = {
      updatedBy: req.user._id,
    };

    if (name) detailsToUpdate.name = name;
    if (description) detailsToUpdate.description = description;

    const boardData = await boardModel
      .findByIdAndUpdate(boardID, { $set: detailsToUpdate }, { new: true })
      .populate("createdBy updatedBy", "name")
      .lean();

    if (!boardData) {
      return next(httpErrors.NotFound(BOARD_CONSTANTS.BOARD_NOT_FOUND));
    }

    const redisService = new RedisServiceClass();
    await redisService.deleteRedisKey(redisBoardsListKey);

    logger.info(
      "Controllers - board - board.controller - updateBoardController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: BOARD_CONSTANTS.SUCCESSFULLY_BOARD_UPDATED,
      data: boardData,
    });
  } catch (error) {
    logger.error(
      "Controllers - board - board.controller - updateBoardController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const deleteBoardController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - board - board.controller - deleteBoardController - Start"
    );

    const { boardID } = req.params;

    const boardData = await boardModel.findByIdAndDelete(boardID);

    if (!boardData) {
      return next(httpErrors.NotFound(BOARD_CONSTANTS.BOARD_NOT_FOUND));
    }

    const redisService = new RedisServiceClass();
    await redisService.deleteRedisKey(redisBoardsListKey);

    logger.info(
      "Controllers - board - board.controller - updateBoardController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: BOARD_CONSTANTS.SUCCESSFULLY_BOARD_DELETED,
    });
  } catch (error) {
    logger.error(
      "Controllers - board - board.controller - updateBoardController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createNewBoardController,
  getSingleBoardDetailController,
  getBoardsListController,
  updateBoardController,
  deleteBoardController,
};
