const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const moment = require("moment");
const enrollmentProgressModel = require("../../Schema/enrollment-progress/enrollmentProgress.model");
const homeworkModel = require("../../Schema/homework/homework.schema");
const notificationModel = require("../../Schema/notification/notification.schema");
const { emitNotificationToStudent } = require("../../Utils/socket.utils");

const createStudentHomeworkController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - homework - homework.controller - createStudentHomeworkController - Start"
    );

    const { studentId } = req.params;
    const batchId = req.batch._id;

    let enrollmentDetails = await enrollmentProgressModel
      .findOne({
        studentId,
        batch: batchId,
      })
      .populate("studentId", "name class")
      .lean();

    if (!enrollmentDetails)
      return next(httpErrors.BadRequest("student enrollment is required!"));

    const details = {
      ...req.body,
      assignedBy: req.user._id,
      student: studentId,
      class: enrollmentDetails.studentId.class,
      batch: batchId,
      enrollment: enrollmentDetails._id,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };

    if (!details?.deadline) {
      details.deadline = moment().add(1, "day").toDate();
    }

    const newHomeworkDetails = new homeworkModel(details);
    await newHomeworkDetails.save();

    let newNotificationData = await notificationModel.create({
      message: `New homework assigned: ${
        details.title || "Untitled Homework"
      }. Deadline: ${moment(details.deadline).format("YYYY-MM-DD HH:mm")}`,
      type: "home_work",
      recipientType: "student",
      recipientUser: studentId,
      url: `/my-homeworks/${newHomeworkDetails._id}`,
    });

    await emitNotificationToStudent({
      notificationData: newNotificationData.toObject(),
      studentId: studentId,
    });

    logger.info(
      "Controllers - homework - homework.controller - createStudentHomeworkController - End"
    );

    res.status(201).send({
      success: true,
      statusCode: 201,
      message: "homework successfully created.",
      data: newHomeworkDetails,
    });
  } catch (error) {
    logger.error(
      "Controllers - homework - homework.controller - createStudentHomeworkController - End",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getHomeworkListController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - homework - homework.controller - getHomeworksController - Start"
    );

    let { limit = 15, page = 1, sort = "-createdAt" } = req.query;
    const {
      student = null,
      class: studentClass = null,
      status = null,
      assignedBy = null,
    } = req.query;

    limit = Number(limit);
    page = Number(page);

    const skip_docs = (page - 1) * limit;

    const query = {};
    if (student) query.student = student;
    if (studentClass) query.class = studentClass;
    if (status) query.status = status;
    if (assignedBy) query.assignedBy = assignedBy;

    const totalDocs = await homeworkModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await homeworkModel
      .find(query)
      .skip(skip_docs)
      .limit(limit)
      .sort(sortConstants[sort] || sortConstants["-createdAt"])
      // .populate("assignedBy", "name")
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
      "Controllers - homework - homework.controller - getHomeworksController - End"
    );

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Homeworks fetched successfully",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - homework - homework.controller - getHomeworksController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getSingleHomeworkController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - homework - homework.controller - getSingleHomeworkController - Start"
    );

    const { homeworkId } = req.params;

    const homework = await homeworkModel
      .findById(homeworkId)
      .populate("assignedBy", "name")
      .lean();

    if (!homework) {
      return next(httpErrors.NotFound("Homework not found"));
    }

    logger.info(
      "Controllers - homework - homework.controller - getSingleHomeworkController - End"
    );

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Homework fetched successfully.",
      data: homework,
    });
  } catch (error) {
    logger.error(
      "Controllers - homework - homework.controller - getSingleHomeworkController - End",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const assignHomeworkRatingController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - homework - homework.controller - assignHomeworkRatingController - Start"
    );

    const { homeworkId } = req.params;
    const { rating = null, feedback = null } = req.body;

    if (
      rating !== null &&
      (typeof rating !== "number" || rating < 1 || rating > 5)
    ) {
      return next(
        httpErrors.BadRequest("Rating must be a number between 1 and 5.")
      );
    }

    const update = {
      rating,
      feedback,
      ratedOn: rating !== null ? new Date() : null,
      updatedBy: req.user._id,
    };

    const updatedHomework = await homeworkModel
      .findByIdAndUpdate(homeworkId, { $set: update }, { new: true })
      .lean();

    if (!updatedHomework) {
      return next(httpErrors.NotFound("Homework not found"));
    }

    // Create notification for homework rating
    let studentId = updatedHomework.student.toString();
    let newNotificationData = await notificationModel.create({
      message: `Your homework "${
        updatedHomework.title || "Untitled Homework"
      }" has been rated${rating ? `: ${rating} star(s)` : ""}.`,
      type: "home_work",
      recipientType: "student",
      recipientUser: studentId,
      url: `/my-homeworks/${updatedHomework._id}`,
    });

    await emitNotificationToStudent({
      notificationData: newNotificationData.toObject(),
      studentId: studentId,
    });

    logger.info(
      "Controllers - homework - homework.controller - assignHomeworkRatingController - End"
    );

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Homework rating assigned successfully.",
      data: updatedHomework,
    });
  } catch (error) {
    logger.error(
      "Controllers - homework - homework.controller - assignHomeworkRatingController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateHomeworkController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - homework - homework.controller - updateHomeworkController - Start"
    );

    const { homeworkId } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    };

    const updatedHomework = await homeworkModel
      .findByIdAndUpdate(homeworkId, { $set: updateData }, { new: true })
      .lean();

    if (!updatedHomework) {
      return next(httpErrors.NotFound("Homework not found"));
    }

    logger.info(
      "Controllers - homework - homework.controller - updateHomeworkController - End"
    );

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Homework updated successfully.",
      data: updatedHomework,
    });
  } catch (error) {
    logger.error(
      "Controllers - homework - homework.controller - updateHomeworkController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const deleteHomeworkController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - homework - homework.controller - deleteHomeworkController - Start"
    );

    const { homeworkId } = req.params;

    const deletedHomework = await homeworkModel
      .findByIdAndDelete(homeworkId)
      .lean();

    if (!deletedHomework) {
      return next(httpErrors.NotFound("Homework not found"));
    }

    logger.info(
      "Controllers - homework - homework.controller - deleteHomeworkController - End"
    );

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Homework deleted successfully.",
      data: deletedHomework,
    });
  } catch (error) {
    logger.error(
      "Controllers - homework - homework.controller - deleteHomeworkController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createStudentHomeworkController,
  getSingleHomeworkController,
  getHomeworkListController,
  assignHomeworkRatingController,
  updateHomeworkController,
  deleteHomeworkController,
};
