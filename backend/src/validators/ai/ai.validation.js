const { celebrate, Joi } = require("celebrate");

const textBuilderAiPromptValidation = celebrate({
  body: Joi.object({
    userPrompt: Joi.string().trim().required().label("user prompt"),
  }),
});

const createNewChatSessionValidation = celebrate({
  body: Joi.object({
    userId: Joi.string().optional().allow(null).default(null).label("user ID"),
  }),
});

const publicHomeAiAgentValidation = celebrate({
  body: Joi.object({
    userPrompt: Joi.string().trim().required().label("user prompt"),
  }),
});

module.exports = {
  textBuilderAiPromptValidation,
  createNewChatSessionValidation,
  publicHomeAiAgentValidation,
};
