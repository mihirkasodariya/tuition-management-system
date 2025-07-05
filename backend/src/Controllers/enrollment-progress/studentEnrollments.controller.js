const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const enrollmentProgressModel = require("../../Schema/enrollment-progress/enrollmentProgress.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");

const getMyAllEnrollmentsController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - enrollmentProgress - studentEnrollmentProgress.controller - getMyAllEnrollmentsController - Start"
    );
    const studentId = req.user._id;

    let enrollments = await enrollmentProgressModel
      .find({ studentId })
      .populate("batch board studentId subjects.subjectId", "name")
      .sort(sortConstants["-createdAt"]);

    logger.info(
      "Controllers - enrollmentProgress - studentEnrollmentProgress.controller - getMyAllEnrollmentsController - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "enrollments list",
      data: enrollments,
    });
  } catch (error) {
    logger.error(
      "Controllers - enrollmentProgress - studentEnrollmentProgress.controller - getMyAllEnrollmentsController  - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  getMyAllEnrollmentsController,
};
