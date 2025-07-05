const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const AgentService = require("../../Services/agent.service");
const TwilioService = require("../../Services/twilio.service");
const agentChatModel = require("../../Schema/agent-chat/agentChat.model");
const httpError = require("http-errors");
const CallingAgentService = require("../../Services/callagent.service");
const callAgentChatModel = require("../../Schema/agent-chat/callagentChat.model");

const callInitialController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - call_agents.controller - callInitialController - Start"
    );

    const phoneNumber = "+919347222304";
    const twilioMlNextUrl = "/voice";

    const twilioService = new TwilioService();

    const callDetails = await twilioService.makeCall(
      phoneNumber,
      twilioMlNextUrl
    );

    // console.log(callDetails);

    let details = new callAgentChatModel({
      sid: callDetails.sid,
      to: callDetails.to,
      callDetails: {
        sid: callDetails.sid,
        dateCreated: callDetails.dateCreated,
        dateUpdated: callDetails.dateUpdated,
        accountSid: callDetails.accountSid,
        to: callDetails.to,
        toFormatted: callDetails.toFormatted,
        from: callDetails.from,
        fromFormatted: callDetails.fromFormatted,
        startTime: callDetails.startTime,
        endTime: callDetails.endTime,
        duration: callDetails.duration,
        price: callDetails.price,
        direction: callDetails.direction,
        answeredBy: callDetails.answeredBy,
      },
      messages: [],
      history: [],
    });

    await details.save();

    logger.info(
      "Controller - call_agents.controller - callInitialController - End"
    );
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "caller initiated successfully",
      data: details,
      callDetails,
    });
  } catch (error) {
    logger.error(
      "Controller - call_agents.controller - callInitialController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const voiceCallAgentController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - call_agents.controller - voiceCallAgentController - start"
    );

    const twilioService = new TwilioService();
    const resultXml = await twilioService.voiceResponse();

    logger.info(
      "Controller - call_agents.controller - voiceCallAgentController - End"
    );
    res.type("text/xml").send(resultXml);
  } catch (error) {
    logger.error(
      "Controller -  call_agents.controller - voiceCallAgentController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const processSpeechAgentController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - call_agents.controller - processSpeechAgentController - Start"
    );

    const { SpeechResult, CallSid } = req.body;

    let isSessionExist = await callAgentChatModel.findOne({ sid: CallSid });

    if (!isSessionExist) {
      return next(httpError(404, "Session not found"));
    }

    const userTimestamp = new Date();

    // console.log(req.body);
    const twilioService = new TwilioService();
    const { resultXml, data = null } = await twilioService.processSpeech({
      speechResult: SpeechResult,
      sessionDetails: isSessionExist,
      historyCount: 6,
    });

    logger.info(
      "Controller - call_agents.controller - processSpeechAgentController - End"
    );

    if (data) {
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
    }

    res.type("text/xml").send(resultXml);
  } catch (error) {
    logger.error(
      "Controller - call_agents.controller - processSpeechAgentController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const continueAiCallingAgentController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - call_agents.controller - continueAiCallingAgentController - start"
    );

    const twilioService = new TwilioService();
    const resultXml = await twilioService.continueResponse();

    logger.info(
      "Controller - call_agents.controller - continueAiCallingAgentController - End"
    );
    res.type("text/xml").send(resultXml);
  } catch (error) {
    logger.error(
      "Controller -  call_agents.controller - continueAiCallingAgentController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const testController = async (req, res, next) => {
  let message = "i need  student details";
  let sid = "CA760a2641c02c0c68a32e59e29b602c12";

  let isSessionExist = await callAgentChatModel.findOne({ sid });

  if (!isSessionExist) {
    return next(httpError(404, "Session not found"));
  }

  const userTimestamp = new Date();

  let callingAgentService = new CallingAgentService({
    sessionId: sid,
    historyCount: 6,
  });

  const data = await callingAgentService.processRequest(
    message,
    isSessionExist
  );

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
    isSessionExist,
    data,
  });
};

module.exports = {
  callInitialController,
  voiceCallAgentController,
  processSpeechAgentController,
  continueAiCallingAgentController,
  testController,
};
