const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const axios = require("axios");
const { OPEN_ROUTER_API_KEY } = require("../../Config/index.config");
const agentChatModel = require("../../Schema/agent-chat/agentChat.model");

const publicHomeAiAgentController = async (req, res, next) => {
  try {
    logger.info("Controller - ai.controller - publicAiAgentController - Start");

    const { userPrompt } = req.body;
    const { sessionId } = req.params;
    let isSessionExist = await agentChatModel.findById(sessionId);

    if (!isSessionExist) {
      return next(httpErrors(404, "Session not found"));
    }
    const userTimestamp = new Date();

    const finalPrompt = `
      You are an AI teaching assistant for AcademIQ Tutorial, an educational platform dedicated to 
      providing clear and accurate learning resources. Your responses should be:

      1. Professional yet approachable in tone
      2. Factually accurate and educationally sound
      3. Structured for easy reading (but without markdown formatting)
      4. Focused on the educational needs of students
      5. Limited to academic and learning-related topics

      If the question is not education-related, politely decline to answer and suggest academic topics.

      Current request: ${userPrompt}

      Please provide a helpful, depending upon the request provide a extra-short/short/medium/detailed response suitable for students of all levels.
    `;

    const url = "https://openrouter.ai/api/v1/chat/completions";
    const config = {
      headers: {
        Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "AcademIQ",
        Referer: "https://www.AcademIQtutorial.com",
      },
    };
    const json = {
      model: "meta-llama/llama-4-scout:free",
      messages: [
        {
          role: "system",
          content:
            "You are an AI teaching assistant for AcademIQ Tutorial, focused on providing high-quality educational content.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: finalPrompt,
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const { data } = await axios.post(url, json, config);

    const generatedText = data.choices[0].message.content;

    isSessionExist.messages.push(
      {
        content: userPrompt,
        role: "user",
        timestamp: userTimestamp,
      },
      {
        content: generatedText,
        role: "ai",
        timestamp: new Date(),
      }
    );

    await isSessionExist.save();
    logger.info(
      "Controller - ai.controller - publicAiAgentController - Session updated successfully"
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "AI response generated successfully",
      data: {
        details: isSessionExist,
        outputData: {
          input: userPrompt,
          output: generatedText,
        },
      },
    });
    logger.info("Controller - ai.controller - publicAiAgentController - End");
  } catch (error) {
    logger.error(
      "Controller - ai.controller - publicAiAgentController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  publicHomeAiAgentController,
};
