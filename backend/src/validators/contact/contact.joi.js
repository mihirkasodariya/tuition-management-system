const { celebrate, Joi } = require("celebrate");

const createContactFormValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(50).label("Name"),
    email: Joi.string().required().email().trim().label("Email"),
    phone: Joi.string()
      .required()
      .min(10)
      .max(15)
      .pattern(/^[0-9]+$/)
      .message("Phone number must contain only digits")
      .label("Phone Number"),
    studentClass: Joi.number().required().min(1).max(12).label("Class"),
    preferredTime: Joi.string()
      .valid("morning", "afternoon", "evening", "any")
      .default("any")
      .label("Preferred Time"),
    message: Joi.string().optional().trim().label("Message"),
    heardAboutUs: Joi.string()
      .valid("friend", "social media", "newspaper", "flyer", "website", "other")
      .default("website")
      .label("Heard About Us"),
  }),
});

module.exports = {
  createContactFormValidation,
};
