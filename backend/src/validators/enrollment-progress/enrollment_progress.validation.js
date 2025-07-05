const { celebrate, Joi } = require("celebrate");

// Validation for creating a new subject
const addNewEnrollmentValidations = celebrate({
  body: Joi.object({
    batch: Joi.string().required().label("Batch"),
    studentId: Joi.string().required().label("Student Id"),
    subjects: Joi.array()
      .items(Joi.string())
      .min(1)
      .required()
      .label("Subjects"),
  }),
});

const updateStudentProgressValidation = celebrate({
  body: Joi.object({
    chapters: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().required().label("SubjectId"),
          progress: Joi.number().min(0).max(100).default(0),
          subChapters: Joi.array()
            .items(
              Joi.object({
                topicProgress: Joi.number().min(0).max(100).required(),
                _id: Joi.string().required().label("topic Id"),
              })
            )
            .required()
            .min(1)
            .label("subChapters"),
        })
      )
      .min(1)
      .required()
      .label("Chapters"),
  }),
});
module.exports = {
  addNewEnrollmentValidations,
  updateStudentProgressValidation,
};
