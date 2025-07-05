const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const attendanceModel = require("../../Schema/attendance/attendance.model");
const enrollmentProgressModel = require("../../Schema/enrollment-progress/enrollmentProgress.model");
const userModel = require("../../Schema/users/user.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const moment = require("moment");

const getStudentAttendanceListController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - attendance - student.attendance.controller - getStudentAttendanceListController - Start"
    );

    const studentId = req.user._id;

    let {
      limit = 15,
      page = 1,
      sort = "-createdAt",
      startDate,
      endDate,
    } = req.query;

    const { batch = null } = req.query;

    let query = {
      student: studentId,
      batch: batch ?? req.batch._id,
    };
    let queryCount = { ...query };

    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.startDate = { $lte: new Date(endDate) };
    }

    limit = Number(limit);
    page = Number(page);

    const skip_docs = (page - 1) * limit;

    const totalDocs = await attendanceModel.countDocuments(queryCount);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await attendanceModel
      .find(query)
      .skip(skip_docs)
      .limit(limit)
      .select("-googleMeet.details")
      .populate("subject", "name")
      .populate("progress.chapter", "title")
      .sort(sortConstants[sort] || sortConstants["-createdAt"])
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
      "Controllers - attendance - student.attendance.controller - getStudentAttendanceListController - End"
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Attendance list fetched successfully.",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - attendance - student.attendance.controller - getStudentAttendanceListController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  getStudentAttendanceListController,
};
