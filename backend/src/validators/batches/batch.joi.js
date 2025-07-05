const { celebrate, Joi } = require("celebrate");
// Validation for creating a new batch
const createBatchValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(50).label("Batch Name"),
    startDate: Joi.date().required().label("Start Date"),
    endDate: Joi.date().required().label("End Date"),
  }),
});

// Validation for updating a batch
const updateBatchValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(50).optional().label("Batch Name"),
    startDate: Joi.date().optional().label("Start Date"),
    endDate: Joi.date().optional().label("End Date"),
  }),
});

// Validation for listing batches with pagination
const listBatchesValidation = celebrate({
  query: Joi.object({
    sort: Joi.string()
      .valid("-createdAt", "+createdAt")
      .optional()
      .label("Sort Order"),
  }),
});

module.exports = {
  createBatchValidation,
  updateBatchValidation,
  listBatchesValidation,
};
