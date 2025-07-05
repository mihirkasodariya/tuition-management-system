const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const moment = require("moment");
const homeworkModel = require("../../Schema/homework/homework.schema");

const getStudentHomeworkListController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - homework - studentHomework.controller - getStudentHomeworkListController - Start"
    );

    let { limit = 15, page = 1, sort = "-createdAt" } = req.query;
    const { class: studentClass = null, status = null } = req.query;

    limit = Number(limit);
    page = Number(page);

    const skip_docs = (page - 1) * limit;

    const query = {};
    query.student = req.user._id;
    if (studentClass) query.class = studentClass;
    if (status) query.status = status;

    const totalDocs = await homeworkModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await homeworkModel
      .find(query)
      .skip(skip_docs)
      .limit(limit)
      .sort(sortConstants[sort] || sortConstants["-createdAt"])
      .populate("assignedBy", "name")
      .lean();

    const hasNext = totalDocs > skip_docs + limit;
    const hasPrev = page > 1;

    const data = {
      totalDocs,
      totalPages,
      docs,
      currentPage: page,
      hasNext,
      hasPrev,
      limit,
    };

    logger.info(
      "Controllers - homework - studentHomework.controller - getStudentHomeworkListController - End"
    );

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Homeworks fetched successfully",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - homework - studentHomework.controller - getStudentHomeworkListController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  getStudentHomeworkListController,
};
