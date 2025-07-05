const {
  SESClient,
  SendEmailCommand,
  SendTemplatedEmailCommand,
} = require("@aws-sdk/client-ses");
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_SES_SENDER,
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

class AwsMailServiceClass {
  constructor() {
    this.SESClientConfig = {
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    };
  }

  async getTemplateData(templateName, subject, placeholderData) {
    const template = JsonTemplatesCollection[templateName];
    const templateFileData = await getTemplateFromFile(
      template.fileName,
      placeholderData
    );
    template.Message.Body.Html.Data =
      templateFileData || template.Message.Body.Text.Data;

    if (subject) {
      template.Message.Subject.Data = subject;
    }
    return template;
  }

  async sendEmail(to, templateName, subject, placeholderData) {
    try {
      logger.info("AWS SES - mail service - sendEmail - Start");
      const template = await this.getTemplateData(
        templateName,
        subject,
        placeholderData
      );
      const params = {
        Destination: {
          ToAddresses: Array.isArray(to) ? to : [to],
        },
        Message: template.Message,
        Source: AWS_SES_SENDER,
        ReplyToAddresses: [],
      };
      const sesClient = new SESClient(this.SESClientConfig);
      const commandToSendEmail = new SendEmailCommand(params);
      const response = await sesClient.send(commandToSendEmail);
      logger.info("AWS SES - mail service - sendEmail - End");
      return response;
    } catch (error) {
      logger.error("AWS SES - mail service - sendEmail - Error", error);
      throw error;
    }
  }
  // send templated email using AWS SES
  async sendTemplatedEmail(to, templateName, placeholderData) {
    try {
      logger.info("AWS SES - mail service - sendTemplatedEmail - Start");
      const params = {
        Destination: {
          ToAddresses: Array.isArray(to) ? to : [to],
        },
        Template: templateName,
        TemplateData: JSON.stringify(placeholderData),
        Source: AWS_SES_SENDER,
      };
      const sesClient = new SESClient(this.SESClientConfig);
      const commandToSendEmail = new SendTemplatedEmailCommand(params);
      const response = await sesClient.send(commandToSendEmail);
      logger.info("AWS SES - mail service - sendTemplatedEmail - End");
      return response;
    } catch (error) {
      logger.error(
        "AWS SES - mail service - sendTemplatedEmail - Error",
        error
      );
      throw error;
    }
  }
}

module.exports = AwsMailServiceClass;
