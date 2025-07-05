const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const AgentService = require("../../Services/agent.service");
const agentChatModel = require("../../Schema/agent-chat/agentChat.model");
const httpError = require("http-errors");

const agentChatController = async (req, res, next) => {
  try {
    logger.info("Controller - agent.controller - agentChatController - start");

    const { sessionId } = req.params;
    let isSessionExist = await agentChatModel.findById(sessionId);

    if (!isSessionExist) {
      return next(httpError(404, "Session not found"));
    }
    const userTimestamp = new Date();

    const { userPrompt, historyCount = 6 } = req.body;

    const agentService = new AgentService({ sessionId, historyCount });
    const data = await agentService.processRequest(userPrompt, isSessionExist);

    isSessionExist.messages.push(
      {
        content: data?.input || "",
        role: "user",
        timestamp: userTimestamp,
      },
      {
        content: data?.output || "",
        role: "ai",
        timestamp: new Date(),
      }
    );

    isSessionExist.history = [
      ...isSessionExist.history,
      ...(data?.history ? data.history.slice(-2) : []),
    ];

    await isSessionExist.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        details: isSessionExist,
        outputData: data,
      },
    });
    logger.info("Controller - agent.controller - agentChatController - end");
  } catch (error) {
    logger.error(
      "Controller - agent.controller - agentChatController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const createNewChatSession = async (req, res, next) => {
  try {
    logger.info("Controller - agent.controller - createNewChatSession - start");

    const userId = req?.user?._id || "672493276aa409505ecd9b43";

    const newSession = new agentChatModel({
      user: userId,
      createdBy: userId,
      updatedBy: userId,
      messages: [],
      history: [],
    });
    await newSession.save();

    logger.info("Controller - agent.controller - createNewChatSession - End");
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "New chat session created successfully",
      sessionId: newSession._id,
      data: newSession,
    });
  } catch (error) {
    logger.error(
      "Controller - agent.controller - createNewChatSession - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getSessionDetails = async (req, res, next) => {
  try {
    logger.info("Controller - agent.controller - getSessionDetails - start");

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

    logger.info("Controller - agent.controller - getSessionDetails - end");
  } catch (error) {
    logger.error(
      "Controller - agent.controller - getSessionDetails - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const publicChatAgentController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - agent.controller - publicAgentController - start"
    );

    const { sessionId } = req.params;
    // let isSessionExist = await agentChatModel.findById(sessionId);

    // if (!isSessionExist) {
    //   return next(httpError(404, "Session not found"));
    // }
    // const userTimestamp = new Date();

    const { message, historyCount = 2 } = req.body;

    const agentService = new AgentService({ sessionId, historyCount });
    const data = await agentService.publicAgentRequest(
      message,
      (isSessionExist = {})
    );

    // isSessionExist.messages.push(
    //   {
    //     content: data?.input || "",
    //     role: "user",
    //     timestamp: userTimestamp,
    //   },
    //   {
    //     content: data?.output || "",
    //     role: "ai",
    //     timestamp: new Date(),
    //   }
    // );

    // isSessionExist.history = [
    //   ...isSessionExist.history,
    //   ...(data?.history ? data.history.slice(-2) : []),
    // ];

    // await isSessionExist.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        // details: isSessionExist,
        outputData: data,
      },
    });
    logger.info("Controller - agent.controller - publicAgentController - end");
  } catch (error) {
    logger.error(
      "Controller - agent.controller - publicAgentController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};
module.exports = {
  agentChatController,
  publicChatAgentController,
  createNewChatSession,
  getSessionDetails,
};
