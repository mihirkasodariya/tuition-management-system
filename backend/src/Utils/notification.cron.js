const logger = require("../Config/logger.config");
const notificationModel = require("../Schema/notification/notification.schema");
const errorHandling = require("../Utils/errorHandling");
const moment = require("moment");

const deleteNotificationUtility = async () => {
  try {
    logger.info(
      "Utils - notification.cron - deleteNotificationUtility - Start"
    );

    const twoDaysAgo = moment().subtract(2, "days").startOf("day").toDate();
    const result = await notificationModel.deleteMany({
      createdAt: { $lte: twoDaysAgo },
    });
    logger.info(
      `Deleted ${result.deletedCount} notifications older than 2 days.`
    );
    logger.info("Utils - notification.cron - deleteNotificationUtility - End");
  } catch (error) {
    logger.error(
      "Utils - notification.cron - deleteNotificationUtility - Error",
      error
    );
    throw error;
  }
};

module.exports = {
  deleteNotificationUtility,
};
