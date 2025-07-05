const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const userModel = require("../../Schema/users/user.model");
const { ADMIN, STUDENT } = require("../../Constants/roles.constants");
const errorHandling = require("../../Utils/errorHandling");
const enrollmentProgressModel = require("../../Schema/enrollment-progress/enrollmentProgress.model");
const moment = require("moment");

const attendanceModel = require("../../Schema/attendance/attendance.model");

const studentDashboardGraphController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - graphs - student.controller - studentDashboardGraphController - Start"
    );

    const startDate = moment().subtract(1, "month").startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();
    const studentId = req?.query?.studentId ?? req.user?._id;

    let attendanceGraphData = await attendanceModel
      .find({
        startDate: {
          $gte: startDate,
          $lte: endDate,
        },
        student: studentId,
        batch: req.batch._id,
      })
      .sort("+startDate")
      .select("startDate isPresent")
      .lean();

    let subjectProgressGraphData = await enrollmentProgressModel
      .findOne({ studentId, batch: req.batch._id })
      .populate("batch board studentId subjects.subjectId", "name")
      .lean();

    subjectProgressGraphData.subjectsProgress =
      subjectProgressGraphData?.subjects.map((subject) => {
        const totalChapterProgress = subject.chapters.reduce(
          (sum, chap) => sum + chap.progress,
          0
        );
        const avgProgress =
          subject.chapters.length > 0
            ? Math.round(totalChapterProgress / subject.chapters.length)
            : 0;

        return {
          subjectName: subject.subjectId.name,
          progress: avgProgress,
        };
      });

    delete subjectProgressGraphData.subjects;

    res.status(200).send({
      success: true,
      statusCode: 200,
      data: {
        attendanceGraphData,
        subjectProgressGraphData,
      },
    });

    logger.info(
      "Controller - graphs - student.controller - studentDashboardGraphController - End"
    );
  } catch (error) {
    logger.error(
      "Controller - graphs - student.controller - studentDashboardGraphController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  studentDashboardGraphController,
};
