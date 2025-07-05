const logger = require("../Config/logger.config");
const { STUDENT } = require("../Constants/roles.constants");
const attendanceModel = require("../Schema/attendance/attendance.model");
const userModel = require("../Schema/users/user.model");
const batchModel = require("../Schema/batches/batch.model");
const LiveClassServiceClass = require("../Services/createLiveClass.service");
const errorHandling = require("../Utils/errorHandling");
const moment = require("moment");
const { USER_ACCOUNT_ID } = require("../Config/index.config");
const { emitNotificationToAdmin } = require("./socket.utils");
const notificationModel = require("../Schema/notification/notification.schema");

const createNewLiveClassUtility = async () => {
  try {
    logger.info(
      "Utils - classReminder.cron -  createNewLiveClassController - Start"
    );
    console.log("Running daily job at 6 AM");

    const currentDay = moment().format("dddd").toLowerCase();

    let dayQuery = "days." + currentDay;

    let currentBatch = await batchModel.findOne({ isActive: true }).lean();

    let studentsList = await userModel
      .find({
        [dayQuery]: true,
        role: STUDENT,
      })
      .lean();

    for (const singleStudent of studentsList) {
      const studentId = singleStudent._id.toString();
      const startTime = singleStudent.timings.startTimeHHMM;
      const endTime = singleStudent.timings.endTimeHHMM;
      const currentDate = moment(startTime, "HH:mm").format("LLL");
      const summary = currentDay + " " + currentDate;
      const description =
        "A live is scheduled " + currentDay + " " + currentDate;

      const createLiveClass = new LiveClassServiceClass(
        studentId,
        singleStudent,
        startTime,
        endTime,
        summary,
        description,
        currentBatch._id.toString(),
        USER_ACCOUNT_ID
      );

      const enrollmentDetailsAvailable =
        await createLiveClass.getEnrollmentId();
      const isClassAvailable = await createLiveClass.checkAvailabilityMethod();

      try {
        if (isClassAvailable === null && enrollmentDetailsAvailable) {
          const meetDetails = await createLiveClass.createGoogleMeetMethod();

          if (meetDetails) {
            const attendanceData = await createLiveClass.createMeetDocument();
            if (attendanceData) {
              await createLiveClass.sendMailMethod();
            }
          }
        }
      } catch (error) {
        console.error("Error scheduling class for student:", studentId, error);
        throw error;
      }
    }

    const newNotificationData = await notificationModel.create({
      message: "Google Meet classes are scheduled.",
      type: "google_meet_cron",
      recipientType: "admin",
      url: "/admin/mark-attendance",
    });

    await emitNotificationToAdmin({
      notificationData: newNotificationData.toObject(),
    });

    logger.info(
      "Utils - classReminder.cron -  createNewLiveClassController   - End"
    );
  } catch (error) {
    logger.error(
      "Utils - classReminder.cron -  createNewLiveClassController   - Error",
      error
    );
    throw error;
    // return error;
  }
};

module.exports = {
  createNewLiveClassUtility,
};
