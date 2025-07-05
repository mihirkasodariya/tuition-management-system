const nodemailer = require("nodemailer");
const {
  NODEMAILER_SERVICE,
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_PASS,
  NODEMAILER_USER,
} = require("../../Config/index.config");
const fs = require("fs");
const path = require("path");
const JsonTemplatesCollection = require("./templateCollection.json");
const logger = require("../../Config/logger.config");

const getTemplateFromFile = async (fileName, placeholderData) => {
  const filePath = path.join(__dirname, "../", "templates", fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  let fileContent = await fs.readFileSync(filePath, "utf-8");

  //   replacing the placeholder with the actual data
  for (const [key, value] of Object.entries(placeholderData)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    fileContent = fileContent.replace(regex, value);
  }
  return fileContent;
};

class NodeMailerServiceClass {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: NODEMAILER_SERVICE,
      host: NODEMAILER_HOST,
      port: NODEMAILER_PORT,
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS,
      },
    });
  }

  async getTemplateData(templateName, subject, placeholderData) {
    const template = JsonTemplatesCollection[templateName];
    const templateFileData = await getTemplateFromFile(
      template.fileName,
      placeholderData
    );
    template.message.html = templateFileData || template.message.text;

    if (subject) {
      template.message.subject = subject;
    }
    return template;
  }

  async sendMail(to, templateName, subject, placeholderData) {
    try {
      logger.info("AWS SES - mail service - sendTemplatedEmail - Start");
      const template = await this.getTemplateData(
        templateName,
        subject,
        placeholderData
      );
      const sendMailOptions = {
        from: NODEMAILER_USER,
        to,
        ...template?.message,
      };

      logger.info("AWS SES - mail service - sendTemplatedEmail - End");
      await this.transporter.sendMail(sendMailOptions);
    } catch (error) {
      logger.error(
        "AWS SES - mail service - sendTemplatedEmail - Error",
        error
      );
      throw error;
    }
  }
}

module.exports = NodeMailerServiceClass;
