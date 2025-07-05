const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const axios = require("axios");
const { OPEN_ROUTER_API_KEY } = require("../../Config/index.config");

const builderTextAiController = async (req, res, next) => {
  try {
    logger.info("Controller - ai.controller - builderTextAiController - Start");

    const { userPrompt } = req.body;
    // const finalPrompt = `Write a clear, concise, and engaging explanation: ${userPrompt}`;
    const finalPrompt = `
                        Write a clear, concise, and engaging explanation in plain text format. 
                        Avoid using **bold**, *italics*, or any other formatting symbols. 
                        Just provide the raw text in a professional tone.
                        Topic: ${userPrompt}
                      `;

    const url = "https://openrouter.ai/api/v1/chat/completions";
    const config = {
      headers: {
        Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "eduexcellenece",
        Referer: "https://www.AcademIQtutorial.com",
      },
    };
    const json = {
      model: "meta-llama/llama-4-scout:free",
      messages: [
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
    };
    const { data } = await axios.post(url, json, config);

    const generatedText = data.choices[0].message.content;

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { generatedText, details: data },
    });
    logger.info("Controller - ai.controller - builderTextAiController - End");
  } catch (error) {
    logger.error(
      "Controller - ai.controller - builderTextAiController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  builderTextAiController,
};
