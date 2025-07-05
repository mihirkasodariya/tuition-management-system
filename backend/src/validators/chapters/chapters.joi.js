const { celebrate, Joi } = require("celebrate");

// Validation for updating  the  chapter details
const updateChapterValidation = celebrate({
  body: Joi.object({
    title: Joi.string().optional().min(2).max(100).label("Chapter Title"),
    content: Joi.string().max(500).optional().label("content"),
    imageURL: Joi.string().optional().label("Image URL"),
    subchapters: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().optional(),
          title: Joi.string()
            .optional()
            .min(2)
            .max(100)
            .label("Subchapter Title"),
          content: Joi.string().optional().label("content"),
          imageURL: Joi.string().optional().label("Image URL"),
        })
      )
      .optional()
      .label("Subchapters"),
  }),
});

module.exports = {
  updateChapterValidation,
};
