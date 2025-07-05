const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN } = require("../../Constants/roles.constants");
const {
  builderTextAiController,
} = require("../../Controllers/ai/builderAi.controller");
const {
  textBuilderAiPromptValidation,
  createNewChatSessionValidation,
  publicHomeAiAgentValidation,
} = require("../../validators/ai/ai.validation");
const {
  publicHomeAiAgentController,
} = require("../../Controllers/ai/publicHomeAi.controller");
const {
  getSessionDetailsController,
  createNewChatSessionController,
} = require("../../Controllers/ai/chatSessions.controller");

const AiRoutes = express.Router();

AiRoutes.route("/builder/text").post(
  Authentication,
  Authorization(ADMIN),
  textBuilderAiPromptValidation,
  builderTextAiController
);

AiRoutes.route("/:sessionId/public-chat-agent").post(
  publicHomeAiAgentValidation,
  publicHomeAiAgentController
);

AiRoutes.route("/chat-agent/new-session").post(
  createNewChatSessionValidation,
  createNewChatSessionController
);

AiRoutes.route("/session-details/:sessionId").get(getSessionDetailsController);

module.exports = AiRoutes;
