const express = require("express");
const AgentRoutes = require("./agents/agent.routes");
const CallAgentRoutes = require("./callagent/callagent.routes");

// Route config
const IndexRoutes = express.Router();

// ----------------------------------------
//  agent  routes
// ----------------------------------------
IndexRoutes.use("/agent", AgentRoutes);
IndexRoutes.use("/calling-agent", CallAgentRoutes);

// export the routes
module.exports = IndexRoutes;
