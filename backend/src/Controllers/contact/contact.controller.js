const httpErrors = require("http-errors");
const logger = require("../../Config/logger.config");
const errorHandling = require("../../Utils/errorHandling");
const contactFormModel = require("../../Schema/contact/contact.model");
const notificationModel = require("../../Schema/notification/notification.schema");
const sortConstants = require("../../Constants/sort.constants");
const NodeMailerServiceClass = require("../../aws_ses/mails/mail.index");
const { emitNotificationToAdmin } = require("../../Utils/socket.utils");

const createContactFormController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - contact.controller - CreateContactFormController - Start"
    );

    const details = {
      ...req.body,
      class: req.body.studentClass,
    };
    delete details.studentClass;

    const newContactDetails = new contactFormModel(details);

    await newContactDetails.save();

    let mailDetails = {
      student_name: newContactDetails.name,
      student_email: newContactDetails.email,
      student_phone: newContactDetails?.phone,
      student_class: newContactDetails?.class,
      student_preferred_timing: newContactDetails?.preferredTime,
    };

    const nodeMailerService = new NodeMailerServiceClass();
    await nodeMailerService.sendMail(
      newContactDetails?.email,
      "contactFormResponseTemplate",
      null,
      mailDetails
    );

    let newNotificationData = await notificationModel.create({
      message: "Contact-Form : " + newContactDetails.name,
      type: "contact_form",
      recipientType: "admin",
      url: "/admin/contact-forms",
    });

    await emitNotificationToAdmin({
      notificationData: newNotificationData.toObject(),
    });

    logger.info(
      "Controller - contact.controller - CreateContactFormController - End"
    );
    res.status(201).send({
      success: true,
      statusCode: 201,
      message: "Contact form submitted successfully",
      data: newContactDetails,
    });
  } catch (error) {
    logger.error(
      "Controller - contact.controller - CreateContactFormController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const getContactSubmissionsController = async (req, res, next) => {
  try {
    logger.info(
      "Controller - contact.controller - GetContactSubmissionsController - Start"
    );

    let { limit = 15, page = 1, sort = "-createdAt" } = req.query;
    const {
      name = null,
      studentClass = null,
      status = null,
      heardAboutUs = null,
    } = req.query;

    limit = Number(limit);
    page = Number(page);

    const skip_docs = (page - 1) * limit;

    const query = {};
    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    if (studentClass) query.class = studentClass;
    if (status) query.status = status;
    if (heardAboutUs) query.heardAboutUs = heardAboutUs;

    const totalDocs = await contactFormModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await contactFormModel
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
      message: "Contact submissions fetched successfully",
      data,
    });

    logger.info(
      "Controller - contact.controller - GetContactSubmissionsController - End"
    );
  } catch (error) {
    logger.error(
      "Controller - contact.controller - GetContactSubmissionsController - Error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  createContactFormController,
  getContactSubmissionsController,
};
