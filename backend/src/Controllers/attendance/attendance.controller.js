const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const attendanceModel = require("../../Schema/attendance/attendance.model");
const enrollmentProgressModel = require("../../Schema/enrollment-progress/enrollmentProgress.model");
const userModel = require("../../Schema/users/user.model");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const userConstants = require("../../Constants/user.constants");
const moment = require("moment");
const NodeMailerServiceClass = require("../../aws_ses/mails/mail.index");
const GoogleCalendarServiceClass = require("../../Services/google.calendar.service");
const { subjects } = require("../../Constants/model.constants");
const { decryptPasswordFunction } = require("../../Utils/encryption");
const { createNewLiveClassUtility } = require("../../Utils/classReminder.cron");

const createNewLiveClassController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - attendance - attendance.controller - createNewLiveClassController - Start"
    );

    const { studentId } = req.params;
    let { summary, description } = req.body;

    let studentDetails = await userModel.findById(studentId).lean();

    if (!studentDetails) {
      return next(httpErrors.NotFound(userConstants.USER_NOT_FOUND));
    }
    const currentDay = moment().format("dddd").toLowerCase();
    const currentDate = moment().format("LLL");

    let studentAvailableOnThisDay = studentDetails?.days?.[currentDay] || false;

    if (!studentAvailableOnThisDay) {
      return next(
        httpErrors.BadRequest("Student is not available to create a live class")
      );
    }
    summary = summary ?? currentDay + " " + currentDate + "";
    description =
      description ??
      "A live is schedule " + currentDay + " " + currentDate + "";
    let startDate = moment(studentDetails?.timings?.startTimeHHMM, "HH:mm");
    let endDate = moment(studentDetails?.timings?.endTimeHHMM, "HH:mm");

    let details = {
      student: studentId,
      summary,
      description,
      startDate,
      endDate,
      day: currentDay,
      class: studentDetails?.class,
      board: studentDetails?.boardType.toString(),
      batch: req.batch._id.toString(),
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };

    const existingRecord = await attendanceModel.findOne({
      student: studentId,
      startDate: startDate,
    });

    if (existingRecord) {
      return next(
        httpErrors.Conflict(
          "Attendance already created for this student on this date."
        )
      );
    }

    const googleCalendarService = await new GoogleCalendarServiceClass(
      req.user._id
    );
    await googleCalendarService.initialize();

    let googleEventDetails = {
      summary: details.summary,
      description: details.description,
      startDate,
      endDate,
      timezone: "Asia/Kolkata",
      location: "Google Meet" || "",
      attendees: [{ email: studentDetails?.email }],
    };

    let eventResponseDetails = await googleCalendarService.createEvent(
      "primary",
      googleEventDetails
    );

    if (eventResponseDetails) {
      details.googleMeet = {
        enabled: true,
        meetLink: eventResponseDetails.hangoutLink,
        conferenceId: eventResponseDetails.conferenceData.conferenceId,
        details: eventResponseDetails,
      };
    }

    const data = new attendanceModel(details);
    await data.save();

    let mailDetails = {
      student_name: studentDetails?.name,
      session_summary: details?.summary,
      session_description: details.description,
      session_date: moment(details.startDate).format("LLL"),
      session_time:
        moment(details.startDate).format("hh:mm A") +
        " - " +
        moment(details.endDate).format("hh:mm A"),
      session_meet_link: details.googleMeet.meetLink,
    };

    const nodeMailerService = new NodeMailerServiceClass();
    await nodeMailerService.sendMail(
      studentDetails.email,
      "liveSessionReminderTemplate",
      null,
      mailDetails
    );

    logger.info(
      "Controllers - attendance - attendance.controller - createNewLiveClassController  - End"
    );
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "successfully new live class is created.",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - attendance - attendance.controller - createNewLiveClassController -   - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getAttendanceListController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - attendance - attendance.controller - getAttendanceListController - Start"
    );

    const { studentId } = req.params;

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
      "Controllers - attendance - attendance.controller - getAttendanceListController - End"
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Attendance list fetched successfully.",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - attendance - attendance.controller - getAttendanceListController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getAttendanceByDateController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - attendance - attendance.controller - getAttendanceByDateController - Start"
    );

    const { date } = req.query;

    let query = {};
    const currentDate = date ? moment(date, "YYYY-MM-DD") : moment();

    // Get start and end of the day in UTC to match stored ISO dates
    const startOfDay = currentDate.startOf("day").toDate(); // 00:00 UTC
    const endOfDay = currentDate.endOf("day").toDate(); // 23:59:59.999 UTC

    query.startDate = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
    const docs = await attendanceModel
      .find(query)
      .select(
        "student startDate  isPresent class board googleMeet.meetLink enrollment progress subject"
      )
      .populate("student board", "name")
      .populate({
        path: "enrollment",
        select: "subjects.subjectId",
        populate: {
          path: "subjects.subjectId",
          model: subjects,
          select: "name",
        },
      })
      .sort(sortConstants["startDate"])
      .lean();

    logger.info(
      "Controllers - attendance - attendance.controller - getAttendanceByDateController - End"
    );

    let data = {
      date: currentDate.format("YYYY-MM-DD"),
      docs,
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Attendance list fetched successfully.",
      data,
    });
  } catch (error) {
    logger.error(
      "Controllers - attendance - attendance.controller - getAttendanceByDateController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateAttendanceDetailsController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - attendance - attendance.controller - updateAttendanceDetailsController - Start"
    );

    const { attendanceId } = req.params;
    const {
      isPresent,
      subject,
      subjectName,
      progress,
      progressDetails,
      studentName,
    } = req.body;

    let details = {
      isPresent,
      subject,
      progress,
      updatedBy: req.user._id,
    };

    const attendanceRecord = await attendanceModel
      .findByIdAndUpdate(attendanceId, { $set: details }, { new: true })
      .populate("student", "name email");

    if (!attendanceRecord) {
      return next(httpErrors.NotFound("Attendance record not found."));
    }

    let enrollmentDetails = await enrollmentProgressModel
      .findById(attendanceRecord.enrollment._id.toString())
      .select("-googleMeet")
      .lean();

    enrollmentDetails?.subjects?.forEach((singleSubject) => {
      let singleSubjectId = singleSubject?.subjectId?.toString();
      if (singleSubjectId === details?.subject) {
        let isChapterExist = singleSubject?.chapters?.find(
          (item) => item?._id?.toString() === details?.progress?.chapter
        );

        if (isChapterExist) {
          let isSubChapterExist = isChapterExist?.subChapters?.find(
            (item) => item?._id === details?.progress?.subChapterId
          );

          if (isSubChapterExist) {
            isSubChapterExist.topicProgress = details?.progress?.value;
          } else {
            isChapterExist?.subChapters?.push({
              _id: details?.progress?.subChapterId,
              topicProgress: details?.progress?.value,
            });
          }

          // Calculate chapter progress (average of all sub-chapter progresses)
          if (isChapterExist.subChapters?.length > 0) {
            const totalProgress = isChapterExist.subChapters.reduce(
              (sum, subChapter) => sum + (subChapter.topicProgress || 0),
              0
            );
            isChapterExist.progress = Math.round(
              totalProgress / isChapterExist.subChapters.length
            );
          }
        } else {
          let newData = {
            _id: details?.progress?.chapter,
            progress: details?.progress?.value,
            subChapters: [
              {
                _id: details?.progress?.subChapterId,
                topicProgress: details?.progress?.value,
              },
            ],
          };
          singleSubject?.chapters.push(newData);
        }
      }
    });

    await enrollmentProgressModel.findByIdAndUpdate(
      enrollmentDetails?._id?.toString(),
      {
        $set: {
          subjects: enrollmentDetails?.subjects,
        },
      }
    );

    logger.info(
      "Controllers - attendance - attendance.controller - updateAttendanceDetailsController - End"
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Attendance details updated successfully.",
      data: { attendance: attendanceRecord, enrollment: enrollmentDetails },
    });
  } catch (error) {
    logger.error(
      "Controllers - attendance - attendance.controller - updateAttendanceDetailsController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const createCronJobHandlerController = async (req, res, next) => {
  try {
    logger.info(
      "Controllers - attendance - attendance.controller - createCronJobHandlerController - Start"
    );

    let codeValue = "Cron@AcademIQ123";
    const { iv, ciphertext } = req.query;
    // let encrypt = {
    //   iv: "rehuIYOSkKllJ958U230cA==",
    //   ciphertext: "lexvdltLSWKGs29og3wI1Ji9ciska8B0XvCzWImIYm8=",
    // };

    let decryptKey = decryptPasswordFunction({
      iv,
      ciphertext,
    });

    if (codeValue !== decryptKey) {
      return next(httpErrors.Unauthorized("key should me match"));
    }
    await createNewLiveClassUtility();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "cron job successfully completed",
    });

    logger.info(
      "Controllers - attendance - attendance.controller - createCronJobHandlerController - End"
    );
  } catch (error) {
    logger.error(
      "Controllers - attendance - attendance.controller - createCronJobHandlerController -   - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createNewLiveClassController,
  getAttendanceListController,
  getAttendanceByDateController,
  updateAttendanceDetailsController,
  createCronJobHandlerController,
};
