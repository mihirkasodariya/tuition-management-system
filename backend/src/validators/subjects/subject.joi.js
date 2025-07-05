const { celebrate, Joi } = require("celebrate");

// Validation for creating a new subject
const createSubjectValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(50).label("Subject Name"),
    code: Joi.string().required().min(2).max(20).label("Subject Code"),
    description: Joi.string().max(500).optional().label("Description"),
    classRoom: Joi.number().min(1).max(12).required().label("class"),
    boardType: Joi.string().required().label("Board Type"),
    chapters: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().required().min(2).max(100).label("Chapter Title"),
          content: Joi.string().max(500).optional().label("content"),
          imageURL: Joi.string().optional().label("Image URL"),
          subchapters: Joi.array()
            .items(
              Joi.object({
                title: Joi.string()
                  .required()
                  .min(2)
                  .max(100)
                  .label("Subchapter Title"),
                content: Joi.string().optional().label("content"),
                imageURL: Joi.string().optional().label("Image URL"),
              })
            )
            .optional()
            .label("Subchapters"),
        })
      )
      .optional()
      .label("Chapters"),
  }),
});

// Validation for updating a subject
const updateSubjectValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(50).optional().label("Subject Name"),
    code: Joi.string().min(2).max(10).optional().label("Subject Code"),
    description: Joi.string().max(500).optional().label("Description"),
  }),
});

// Validation for listing subjects with pagination
const listSubjectsValidation = celebrate({
  query: Joi.object({
    sort: Joi.string()
      .valid("-createdAt", "+createdAt")
      .optional()
      .label("Sort Order"),
    boardType: Joi.string().optional().label("Board Type"),
    batch: Joi.string().optional().label("Board Type"),
    classRoom: Joi.number().min(1).max(12).optional().label("Class Room"),
    name: Joi.string().optional().label("Name"),
  }),
});

module.exports = {
  createSubjectValidation,
  updateSubjectValidation,
  listSubjectsValidation,
};
