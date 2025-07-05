const { celebrate, Joi } = require("celebrate");

const updateNotificationValidation = celebrate({
  body: Joi.object({
    message: Joi.string().optional().trim(),
    url: Joi.string().optional().allow(null),
    type: Joi.string().optional().valid("contact_form", "custom"),
    recipientType: Joi.string().optional().valid("admin", "student", "both"),
    recipientUser: Joi.string().optional(),
    isRead: Joi.boolean().optional(),
  }),
});

module.exports = {
  updateNotificationValidation,
};
