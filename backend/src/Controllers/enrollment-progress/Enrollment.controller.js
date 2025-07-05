const httpErrors = require("http-errors");
const SUBJECT_CONSTANTS = require("../../Constants/subject.constants");
const logger = require("../../Config/logger.config");
const subjectModel = require("../../Schema/subject/subject.model");
const userModel = require("../../Schema/users/user.model");
const enrollmentProgressModel = require("../../Schema/enrollment-progress/enrollmentProgress.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const mongoose = require("mongoose");

const createNewEnrollmentController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - createNewEnrollmentProgressController - Start"
    );
    const { batch, subjects, studentId } = req.body;

    const studentDetails = await userModel.findById(studentId);

    let filterSubjects = subjects?.map((singleSubject) => ({
      _id: singleSubject,
      class: studentDetails?.class,
      boardType: studentDetails?.boardType,
      batch,
    }));
    const subjectDetails = await subjectModel
      .find({ $or: filterSubjects })
      .lean();

    let details = {
      studentId: studentDetails?._id.toString(),
      batch: batch,
      class: studentDetails?.class,
      board: studentDetails?.boardType,
      subjects: subjectDetails?.map((item) => ({
        subjectId: item._id.toString(),
        chapters: [],
      })),
      createdBy: req.user._id,
      updatedBy: req.user._id,
      order: 1,
    };

    let isAlreadyEnrolled = await enrollmentProgressModel.findOne({
      studentId: details.studentId,
      batch: details.batch,
    });

    if (isAlreadyEnrolled) {
      return next(httpErrors.Conflict("Already user is enrolled"));
    }

    const newEnrollment = new enrollmentProgressModel(details);
    await newEnrollment.save();

    logger.info(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - createNewEnrollmentProgressController  - End"
    );
    res.status(201).send({
      success: true,
      statusCode: 201,
      data: newEnrollment,
    });
  } catch (error) {
    logger.error(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - createNewEnrollmentProgressController  - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getAllSingleStudentEnrollmentController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - getAllSingleStudentEnrollmentController - Start"
    );
    const { studentId } = req.params;

    let enrollments = await enrollmentProgressModel
      .find({ studentId })
      .populate("batch board studentId subjects.subjectId", "name")
      .sort(sortConstants["-createdAt"]);

    logger.info(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - getAllSingleStudentEnrollmentController  - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "enrollments list",
      data: enrollments,
    });
  } catch (error) {
    logger.error(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - getAllSingleStudentEnrollmentController  - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateStudentProgressController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - updateStudentProgressController - Start"
    );
    const { enrollmentId, subjectId } = req.params;

    let updatedEnrollments = await enrollmentProgressModel
      .findByIdAndUpdate(
        enrollmentId,
        { $set: { "subjects.$[subject].chapters": req.body.chapters } },
        {
          new: true,
          arrayFilters: [
            { "subject.subjectId": new mongoose.Types.ObjectId(subjectId) },
          ],
        }
      )
      .populate("batch board studentId subjects.subjectId", "name");

    logger.info(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - updateStudentProgressController  - End"
    );
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "successfully student progress is updated",
      data: updatedEnrollments,
    });
  } catch (error) {
    logger.error(
      "Controllers - enrollmentProgress - enrollmentProgress.controller - updateStudentProgressController  - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createNewEnrollmentController,
  getAllSingleStudentEnrollmentController,
  updateStudentProgressController,
};
