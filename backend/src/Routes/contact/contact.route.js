const express = require("express");
const {
  Authentication,
  Authorization,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN } = require("../../Constants/roles.constants");
const {
  createContactFormController,
  getContactSubmissionsController,
} = require("../../Controllers/contact/contact.controller");
const {
  createContactFormValidation,
} = require("../../validators/contact/contact.joi");

const ContactFormRoutes = express.Router();

ContactFormRoutes.route("/new-contact-form").post(
  createContactFormValidation,
  createContactFormController
);

ContactFormRoutes.route("/admin/contacts").get(
  Authentication,
  Authorization(ADMIN),
  getContactSubmissionsController
);

module.exports = ContactFormRoutes;
