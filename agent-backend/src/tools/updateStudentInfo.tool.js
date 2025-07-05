const { DynamicStructuredTool } = require("@langchain/core/tools");
const { z } = require("zod");
const userModel = require("../Schema/users/user.model");
const { STUDENT } = require("../Constants/roles.constants");
const logger = require("../Config/logger.config");

const allowed_update_fields = [
  "name",
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

// Zod schema for timings
const timingsSchema = z
  .object({
    start: z.string().describe("Start time as ISO date string"),
    startTimeHHMM: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
    end: z.string().describe("End time as ISO date string"),
    endTimeHHMM: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:MM format required"),
  })
  .optional();

// Zod schema for days
const daysSchema = z
  .object({
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
    sunday: z.boolean().optional(),
  })
  .optional();

const updateStudentInfoSchema = z.object({
  email: z.string().describe("The student's valid email address to update"),
  updates: z
    .object({
      name: z.string().optional(),
      gender: z.string().optional(),
      fatherName: z.string().optional(),
      motherName: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      dateOfBirth: z.string().optional(),
      class: z.string().optional(),
      school: z.string().optional(),
      timings: timingsSchema,
      days: daysSchema,
    })
    .describe(
      `Fields that can be updated: ${allowed_update_fields.join(", ")}`
    ),
});

const updateStudentInfoTool = new DynamicStructuredTool({
  name: "updateStudentInfoTool",
  description: `Updates student information. REQUIRES: email and at least one field to update.
  Available fields for update: ${allowed_update_fields.join(", ")}.
  
  For timings: provide { start: ISOString, startTimeHHMM: "HH:MM", end: ISOString, endTimeHHMM: "HH:MM" }
  For days: provide { monday: true/false, tuesday: true/false, ... }
  
  Example: { 
    email: 'john@example.com', 
    updates: { 
      name: 'John Doe', 
      timings: {
        start: "2023-01-01T00:00:00Z",
        startTimeHHMM: "09:00",
        end: "2023-01-01T00:00:00Z",
        endTimeHHMM: "15:00"
      },
      days: {
        monday: true,
        wednesday: true,
        friday: true
      }
    } 
  }
  `,
  schema: updateStudentInfoSchema,
  func: async ({ email, updates }) => {
    try {
      logger.info(
        "Tools - updateStudentInfo.tool - updateStudentInfoTool - Start",
        {
          email,
          updates,
        }
      );

      // Check if at least one update field is provided
      if (Object.keys(updates).length === 0) {
        return "No update fields provided. Please specify at least one field to update.";
      }

      // Check if trying to update restricted fields
      const restrictedFields = Object.keys(updates).filter(
        (field) => !allowed_update_fields.includes(field)
      );

      if (restrictedFields.length > 0) {
        return `Cannot update restricted fields: ${restrictedFields.join(
          ", "
        )}. Allowed fields: ${allowed_update_fields.join(", ")}`;
      }

      // Prepare update object
      const updateObj = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && value !== null) {
          if (key === "timings" || key === "days") {
            // For nested objects, we need to build the update path properly
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              updateObj[`${key}.${nestedKey}`] = nestedValue;
            }
          } else {
            updateObj[key] = value;
          }
        }
      }

      const updatedStudent = await userModel
        .findOneAndUpdate(
          { email, role: STUDENT },
          { $set: updateObj },
          { new: true, runValidators: true }
        )
        .lean();

      if (!updatedStudent) {
        return "Student not found with given email or no changes were made";
      }

      logger.info(
        "Tools - updateStudentInfo.tool - updateStudentInfoTool - End",
        updatedStudent
      );
      return updatedStudent;
    } catch (error) {
      logger.error(
        "Tools - updateStudentInfo.tool - updateStudentInfoTool - Error",
        error
      );
      return (
        error?.message ||
        "Something went wrong while updating student information"
      );
    }
  },
});

module.exports = {
  updateStudentInfoTool,
};
