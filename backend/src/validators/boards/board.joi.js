const { celebrate, Joi } = require("celebrate");

// Validation for creating a new board
const createBoardValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(50).label("Board Name"),
    description: Joi.string().max(500).optional().label("Description"),
  }),
});

// Validation for updating a board
const updateBoardValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(50).optional().label("Board Name"),
    description: Joi.string().max(500).optional().label("Description"),
  }),
});

// Validation for listing boards with pagination
const listBoardsValidation = celebrate({
  query: Joi.object({
    sort: Joi.string()
      .valid("-createdAt", "+createdAt")
      .optional()
      .label("Sort Order"),
  }),
});

module.exports = {
  createBoardValidation,
  updateBoardValidation,
  listBoardsValidation,
};
