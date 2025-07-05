const express = require("express");
const {
  agentChatController,
  createNewChatSession,
  getSessionDetails,
  publicChatAgentController,
} = require("../../Controllers/agents/agent.controller");

const AgentRoutes = express.Router();

AgentRoutes.route("/:sessionId/chat-agent").post(agentChatController);

// AgentRoutes.route("/:sessionId/public-chat-agent").post(
//   publicChatAgentController
// );

// AgentRoutes.route("/chat-agent/new-session").get(createNewChatSession);

// AgentRoutes.route("/session-details/:sessionId").get(getSessionDetails);

module.exports = AgentRoutes;
