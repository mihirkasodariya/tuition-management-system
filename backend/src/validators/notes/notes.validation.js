const { celebrate, Joi } = require("celebrate");

const createNewNotesValidation = celebrate({
  body: Joi.object({
    noteName: Joi.string().trim().required().label("note name"),
    description: Joi.string().trim().required().label("description"),
  }),
});

const notesListValidation = celebrate({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().trim().optional(),
  }),
});

const notesUpdateValidation = celebrate({
  body: Joi.object({
    title: Joi.string().trim().optional().label("note name"),
    description: Joi.string().trim().optional().label("description"),
    templateSections: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().valid("column", "row").optional(),
          styleClassName: Joi.string().allow("").optional(),
          styles: Joi.object().optional(),
          properties: Joi.object({
            containerType: Joi.string().optional(),
            columns: Joi.number().optional(),
          }).optional(),
          block: Joi.array()
            .items(
              Joi.object({
                index: Joi.number().required(),
                blockStyleClassName: Joi.string().allow("").optional(),
                blockStyles: Joi.object().optional(),
                subBlock: Joi.array()
                  .items(
                    Joi.object({
                      type: Joi.string()
                        .valid(
                          "text",
                          "editor",
                          "button",
                          "video",
                          "divider",
                          "image"
                        )
                        .required(),
                      label: Joi.string().allow("").optional(),
                      content: Joi.string().allow("").optional(),
                      videoUrl: Joi.string().allow("").optional(),
                      imageUrl: Joi.string().allow("").optional(),
                      alt: Joi.string().allow("").optional(),
                      url: Joi.string().allow("").optional(),
                      styleClass: Joi.string().allow("").optional(),
                      style: Joi.object().optional(),
                      outerStyle: Joi.object().optional(),
                      uuid: Joi.string().required(),
                      _id: Joi.string().optional(),
                    })
                  )
                  .optional(),
                uuid: Joi.string().required(),
                _id: Joi.string().optional(),
              })
            )
            .optional(),
          uuid: Joi.string().required(),
          _id: Joi.string().optional(),
        })
      )
      .optional(),
  }),
});

module.exports = {
  createNewNotesValidation,
  notesListValidation,
  notesUpdateValidation,
};
