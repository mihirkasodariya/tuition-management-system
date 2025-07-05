const { celebrate, Joi } = require("celebrate");
// Validation for creating a new batch
const getAttendanceListValidation = celebrate({
  query: Joi.object({
    sort: Joi.string()
      .valid("-createdAt", "+createdAt")
      .optional()
      .label("Sort Order"),
    batch: Joi.string().optional().label("batchId"),
    limit: Joi.number().min(1).optional().label("Limit"),
    page: Joi.number().min(1).optional().label("Page"),
    startDate: Joi.date().iso().optional().label("Date should be YYYY-MM-DD"),
    endDate: Joi.date().iso().optional().label("Date should be YYYY-MM-DD"),
  }),
});
const getAttendanceDateWiseValidation = celebrate({
  query: Joi.object({
    date: Joi.date().optional().iso().label("date"),
  }),
});

const updateAttendanceDetailsValidation = celebrate({
  body: Joi.object({
    isPresent: Joi.boolean().required().label("Is Present"),
    subject: Joi.string().required().label("Subject ID"),
    subjectName: Joi.string().required().label("Subject Name"),
    progress: Joi.object({
      chapter: Joi.string().required().label("Chapter ID"),
      subChapterId: Joi.string().required().label("Sub-Chapter ID"),
      value: Joi.number().min(0).max(100).required().label("Progress Value"),
    })
      .required()
      .label("Progress"),
    progressDetails: Joi.object({
      chapterName: Joi.string().required().label("Chapter Name"),
      subChapterName: Joi.string().required().label("Sub-Chapter Name"),
      value: Joi.number().min(0).max(100).required().label("Progress Value"),
    })
      .required()
      .label("Progress Details"),
  }),
});

module.exports = {
  getAttendanceListValidation,
  getAttendanceDateWiseValidation,
  updateAttendanceDetailsValidation,
};
