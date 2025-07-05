const cron = require("node-cron");
const { createNewLiveClassUtility } = require("../Utils/classReminder.cron");
const { deleteNotificationUtility } = require("../Utils/notification.cron");

const createLiveClassRemindersCronJob = () => {
  cron.schedule(
    "0 6 * * *",
    () => {
      console.log("Running daily job at 6 AM");
      createNewLiveClassUtility();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

const deleteNotificationCronJob = () => {
  cron.schedule(
    "0 1 * * *",
    () => {
      console.log("Running daily job at 1 AM");
      deleteNotificationUtility();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};
module.exports = {
  createLiveClassRemindersCronJob,
  deleteNotificationCronJob,
};
