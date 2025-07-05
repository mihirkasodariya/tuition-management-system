const { DynamicStructuredTool } = require("@langchain/core/tools");
const boardModel = require("../Schema/boards/board.model");
const logger = require("../Config/logger.config");
const { z } = require("zod");

const getEducationalBoardsTool = new DynamicStructuredTool({
  name: "getEducationalBoardsTool",
  description: `Retrieves educational boards information.`,
  schema: z.object({}),
  func: async () => {
    try {
      logger.info("Tools - getBoards.tool - getBoardsTool - Start");
      const boards = await boardModel.find().select("name description").lean();
      if (!boards || boards.length === 0) return "No boards found";
      logger.info("Tools - getBoards.tool - getBoardsTool - End", boards);
      return JSON.stringify(boards);
    } catch (error) {
      logger.error("Tools - getBoards.tool - getBoardsTool - Error", error);
      return error.message || "Something went wrong";
    }
  },
});

module.exports = { getEducationalBoardsTool };
