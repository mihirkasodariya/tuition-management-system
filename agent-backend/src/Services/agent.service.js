const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatOpenAI } = require("@langchain/openai");
const { AgentExecutor, createToolCallingAgent } = require("langchain/agents");
const { ChatMessageHistory } = require("langchain/memory");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { getStudentInfoTool } = require("../tools/getStudentInfo.tool");
const logger = require("../Config/logger.config");
const { getEducationalBoardsTool } = require("../tools/getBoards.tool");
const { updateStudentInfoTool } = require("../tools/updateStudentInfo.tool");
const { OPENAI_API_KEY } = require("../Config/index.config");

class AgentService {
  constructor({
    maxOutputTokens = 500,
    temperature = 0.7,
    sessionId = null,
    historyCount = 6,
  } = {}) {
    this.maxOutputTokens = maxOutputTokens;
    this.temperature = temperature;
    this.sessionId = sessionId;
    this.historyCount = historyCount;
    this.prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant, Name is AcademIQ Agent. Use tools when appropriate. Ask questions to get any missing required information.",
      ],
      ["placeholder", "{history}"],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    this.googleModel = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      maxOutputTokens: maxOutputTokens,
      temperature: temperature,
    });
  }

  async getMemoryFunction(history = []) {
    try {
      const chatHistory = new ChatMessageHistory();
      const historyCount = this.historyCount || 6; // Default to last 6 messages

      // Take only the last N messages
      const recentHistory = history.slice(-historyCount);

      // Convert raw history to proper message instances
      for (const message of recentHistory) {
        if (message.role === "user" || message.role === "human") {
          await chatHistory.addMessage(new HumanMessage(message.content));
        } else if (message.role === "ai" || message.role === "assistant") {
          await chatHistory.addMessage(new AIMessage(message.content));
        }
      }

      return chatHistory;
    } catch (error) {
      logger.error("Error creating message history:", error);
      return new ChatMessageHistory();
    }
  }

  async processRequest(input = "", sessionData = {}) {
    try {
      logger.info("Service - agent.service - processRequest - Start", input);
      const agent_tools = [
        getStudentInfoTool,
        getEducationalBoardsTool,
        updateStudentInfoTool,
      ];
      // const agent_tools = [getEducationalBoardsTool];

      const agent = createToolCallingAgent({
        llm: this.googleModel,
        tools: agent_tools,
        prompt: this.prompt,
      });

      const agentExecutor = new AgentExecutor({
        agent,
        tools: agent_tools,
        verbose: false,
      });

      const messageHistory = await this.getMemoryFunction(
        sessionData?.messages || []
      );

      const agentWithHistory = new RunnableWithMessageHistory({
        runnable: agentExecutor,
        getMessageHistory: () => messageHistory,
        inputMessagesKey: "input",
        historyMessagesKey: "history",
      });

      const response = await agentWithHistory.invoke(
        {
          input,
        },
        { configurable: { sessionId: this.sessionId } }
      );

      logger.info("Service - agent.service - processRequest - End");
      return response;
    } catch (error) {
      logger.info("Service - agent.service - processRequest - Error", error);
      throw error;
    }
  }

  async publicAgentRequest(input = "") {
    const chat = new ChatOpenAI(
      {
        modelName: "deepseek/deepseek-chat-v3-0324:free",
        temperature: 0.7,
        openAIApiKey: OPENAI_API_KEY,
      },
      {
        basePath: "https://openrouter.ai/api/v1",
        baseUrl: "https://openrouter.ai/api/v1",
        baseOptions: {
          headers: {
            "HTTP-Referer": "https://www.AcademIQtutorial.com",
            "X-Title": "AcademIQ Public Agent",
          },
        },
      }
    );

    const response = await chat.invoke(input);
    return response;
  }
}

module.exports = AgentService;
