const { DynamicStructuredTool } = require("@langchain/core/tools");
const { z } = require("zod");
const userModel = require("../Schema/users/user.model");
const { STUDENT } = require("../Constants/roles.constants");
const logger = require("../Config/logger.config");

const allowed_fields = [
  "name",
  "email",
  "gender",
  "fatherName",
  "motherName",
  "phone",
  "address",
  "dateOfBirth",
  "class",
  "school",
  "timings",
  "days",
];
const getStudentInfoSchema = z.object({
  email: z.string().describe("The student's valid email address"),
  fields: z
    .array(z.enum([...allowed_fields]))
    .optional(`Available fields: ${allowed_fields.join(", ")}`),
});

const getStudentInfoTool = new DynamicStructuredTool({
  name: "getStudentInfoTool",
  description: `Retrieves student information. REQUIRES: email.
  Supports partial field retrieval. 
  Available fields: ${allowed_fields.join(", ")}.
  Example: { email: 'john@example.com', fields: ['name', 'fatherName'] }
  `,
  schema: getStudentInfoSchema,
  func: async ({ email, fields }) => {
    try {
      logger.info("Tools - getStudentInfo.tool - getStudentInfoTool - Start", {
        email,
        fields,
      });
      let selectedFields = fields?.join(" ") || "";
      let studentDetails = await userModel
        .findOne({ email, role: STUDENT })
        .select(selectedFields)
        .lean();
      if (!studentDetails) return "student not found with given email";
      logger.info(
        "Tools - getStudentInfo.tool - getStudentInfoTool - End",
        studentDetails
      );
      return studentDetails;
    } catch (error) {
      logger.info(
        "Tools - getStudentInfo.tool - getStudentInfoTool - Error",
        error
      );
      return error.message || "something went wrong";
    }
  },
});

module.exports = {
  getStudentInfoTool,
};
