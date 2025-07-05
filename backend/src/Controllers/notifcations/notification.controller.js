const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const sortConstants = require("../../Constants/sort.constants");
const notificationModel = require("../../Schema/notification/notification.schema");
const { ADMIN } = require("../../Constants/roles.constants");

const getNotificationsController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - notification.controller - getNotificationsController - Start"
    );

    let { limit = 15, page = 1, sort = "-createdAt" } = req.query;

    limit = Number(limit);
    page = Number(page);

    const skip_docs = (page - 1) * limit;

    const query = {};

    if (req.__type__ === ADMIN) {
      query.recipientType = { $in: ["admin", "both"] };
    } else {
      query.$or = [{ recipientType: "both" }, { recipientUser: req.user._id }];
    }

    const totalDocs = await notificationModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await notificationModel
      .find(query)
      .skip(skip_docs)
      .limit(limit)
      .sort(sortConstants[sort] || sortConstants["-createdAt"]);

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

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Notifications fetched successfully",
      data,
    });

    logger.info(
      "Controller - notification.controller - getNotificationsController - End"
    );
  } catch (error) {
    logger.error(
      "Controller - notification.controller - getNotificationsController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const updateNotificationController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - notification.controller - updateNotificationController - Start"
    );

    const { notificationId } = req.params;
    const updateData = req.body;

    const updatedNotification = await notificationModel.findByIdAndUpdate(
      notificationId,
      updateData,
      { new: true }
    );

    if (!updatedNotification) {
      return next(httpErrors.NotFound("Notification not found"));
    }

    res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Notification updated successfully",
      data: updatedNotification,
    });

    logger.info(
      "Controller - notification.controller - updateNotificationController - End"
    );
  } catch (error) {
    logger.error(
      "Controller - notification.controller - updateNotificationController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  getNotificationsController,
  updateNotificationController,
};
