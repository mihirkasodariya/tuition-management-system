const { celebrate, Joi } = require("celebrate");

const getStudentHomeworkListValidation = celebrate({
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).optional(),
    page: Joi.number().integer().min(1).optional(),
    sort: Joi.string().valid("-createdAt", "+createdAt").optional(),
  }),
});

module.exports = {
  getStudentHomeworkListValidation,
};
