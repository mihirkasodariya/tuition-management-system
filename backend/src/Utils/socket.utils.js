const { getSocketIO } = require("../../socket.io");
const logger = require("../Config/logger.config");
const {
  admin_emit_listeners,
  student_emit_listeners,
} = require("../Constants/socket.constants");

const emitNotificationToAdmin = ({ notificationData }) => {
  const io = getSocketIO();
  logger.info("Utils - emitNotificationToAdmin - Start");
  if (io) {
    let admin_name_room = "edu_excellence_admin";
    const isEmitted = io
      .to(admin_name_room)
      .emit(admin_emit_listeners.adminNotification, {
        ...notificationData,
        timestamp: new Date(),
      });
    logger.info("Utils - emitNotificationToAdmin - End");
    return isEmitted;
  } else {
    logger.info(
      "Utils - emitNotificationToAdmin - Error (Socket.IO instance not available)",
      error
    );
    return false;
  }
};

const emitNotificationToStudent = ({ notificationData, studentId }) => {
  const io = getSocketIO();
  logger.info("Utils - emitNotificationToStudent - Start");
  if (io) {
    let admin_name_room = `student_${studentId}`;
    const isEmitted = io
      .to(admin_name_room)
      .emit(student_emit_listeners.studentNotification, {
        ...notificationData,
        timestamp: new Date(),
      });
    logger.info("Utils - emitNotificationToStudent - End");
    return isEmitted;
  } else {
    logger.info(
      "Utils - emitNotificationToStudent - Error (Socket.IO instance not available)",
      error
    );
    return false;
  }
};

module.exports = {
  emitNotificationToAdmin,
  emitNotificationToStudent,
};
