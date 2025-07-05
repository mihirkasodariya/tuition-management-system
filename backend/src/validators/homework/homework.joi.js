const { celebrate, Joi } = require("celebrate");

const createStudentHomeworkValidation = celebrate({
  body: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().optional().allow(""),
    deadline: Joi.date().iso().optional().label("Date should be YYYY-MM-DD"),
  }),
});

const getHomeworkListValidation = celebrate({
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).optional(),
    page: Joi.number().integer().min(1).optional(),
    sort: Joi.string().valid("-createdAt", "+createdAt").optional(),
    student: Joi.string().optional(),
  }),
});

const assignHomeworkRatingValidation = celebrate({
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(10).required(),
    feedback: Joi.string().optional().allow(""),
  }),
});

const updateHomeworkValidation = celebrate({
  body: Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().optional().allow(""),
    deadline: Joi.date().iso().optional().label("Date should be YYYY-MM-DD"),
  }),
});

module.exports = {
  createStudentHomeworkValidation,
  getHomeworkListValidation,
  assignHomeworkRatingValidation,
  updateHomeworkValidation,
};
