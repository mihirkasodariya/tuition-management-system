const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const agentChatModel = require("../../Schema/agent-chat/agentChat.model");
const httpError = require("http-errors");

const getSessionDetailsController = async (req, res, next) => {
  try {
    logger.info("Controller - ai.controller - getSessionDetails - start");

    const { sessionId } = req.params;
    const sessionData = await agentChatModel.findById(sessionId);

    if (!sessionData) {
      return next(httpError(404, "Session not found"));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: sessionData,
    });

    logger.info("Controller - ai.controller - getSessionDetails - end");
  } catch (error) {
    logger.error(
      "Controller - ai.controller - getSessionDetails - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const createNewChatSessionController = async (req, res, next) => {
  try {
    logger.info("Controller - ai.controller - createNewChatSession - start");

    const userId = req?.body?.userId || null;

    const newSession = new agentChatModel({
      user: userId,
      isPublic: userId ? false : true,
      createdBy: userId,
      updatedBy: userId,
      messages: [],
      history: [],
    });
    await newSession.save();

    logger.info("Controller - ai.controller - createNewChatSession - End");
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "New chat session created successfully",
      sessionId: newSession._id,
      data: newSession,
    });
  } catch (error) {
    logger.error(
      "Controller - ai.controller - createNewChatSession - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  getSessionDetailsController,
  createNewChatSessionController,
};
