const { celebrate, Joi } = require("celebrate");
const passwordComplexity = require("joi-password-complexity");

// register schema
const RegisterStudentValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    gender: Joi.string()
      .valid("male", "female", "other")
      .required()
      .label("Gender"),
    fatherName: Joi.string().required().label("Father's Name"),
    motherName: Joi.string().required().label("Mother's Name"),
    phone: Joi.string().required().label("Phone"),
    address: Joi.string().required().label("Address"),
    dateOfBirth: Joi.date().required().label("Date of Birth"),
    classRoom: Joi.number().min(1).max(12).required().label("Class"),
    school: Joi.string().required().label("School"),
    boardType: Joi.string().required().label("Board Type"),
    timings: Joi.object({
      start: Joi.date().required().label("Start Time"),
      end: Joi.date().required().label("End Time"),
    })
      .required()
      .label("Timings"),
    days: Joi.object({
      monday: Joi.boolean().required(),
      tuesday: Joi.boolean().required(),
      wednesday: Joi.boolean().required(),
      thursday: Joi.boolean().required(),
      friday: Joi.boolean().required(),
      saturday: Joi.boolean().required(),
      sunday: Joi.boolean().required(),
    })
      .required()
      .label("Days"),
    dateOfJoining: Joi.date()
      .required()
      .default(Date.now)
      .label("Date of Joining"),
  }),
});

const updateStudentValidation = celebrate({
  body: Joi.object({
    name: Joi.string().optional().label("Name"),
    email: Joi.string().email().optional().label("Email"),
    password: passwordComplexity().optional().label("Password"),
    gender: Joi.string()
      .valid("male", "female", "other")
      .optional()
      .label("Gender"),
    fatherName: Joi.string().optional().label("Father's Name"),
    motherName: Joi.string().optional().label("Mother's Name"),
    phone: Joi.string().optional().label("Phone"),
    address: Joi.string().optional().label("Address"),
    dateOfBirth: Joi.date().optional().label("Date of Birth"),
    classRoom: Joi.number().min(1).max(12).optional().label("Class"),
    school: Joi.string().optional().label("School"),
    boardType: Joi.string().optional().label("Board Type"),
    timings: Joi.object({
      start: Joi.date().required().label("Start Time"),
      end: Joi.date().required().label("End Time"),
    })
      .optional()
      .label("Timings"),
    days: Joi.object({
      monday: Joi.boolean().required(),
      tuesday: Joi.boolean().required(),
      wednesday: Joi.boolean().required(),
      thursday: Joi.boolean().required(),
      friday: Joi.boolean().required(),
      saturday: Joi.boolean().required(),
      sunday: Joi.boolean().required(),
    })
      .optional()
      .label("Days"),
    dateOfJoining: Joi.date().optional().label("Date of Joining"),
  }),
});

// Login schema
const LoginUserValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().required().label("email"),
    password: Joi.object({
      iv: Joi.string().required(),
      ciphertext: Joi.string().required(),
    }),
  }),
});

// Update password schema
const updatePasswordValidation = celebrate({
  body: Joi.object({
    password: passwordComplexity().required().label("Old Password"),
    newPassword: passwordComplexity().required().label("New Password"),
  }),
});

// password validation schema
const StrongPasswordValidation = (body) => {
  const schema = Joi.object({
    password: passwordComplexity().required().label("password"),
  });
  const { error } = schema.validate(body);
  if (error) {
    return error.details[0].message;
  }

  return null;
};

const getStudentsValidation = celebrate({
  query: Joi.object({
    sort: Joi.string()
      .valid("-createdAt", "+createdAt")
      .optional()
      .label("Sort Order"),
    boardType: Joi.string().optional().label("Board Type"),
    classRoom: Joi.number().min(1).max(12).optional().label("Class Room"),
    name: Joi.string().optional().label("Name"),
    limit: Joi.number().min(1).optional().label("Limit"),
    page: Joi.number().min(1).optional().label("Page"),
  }),
});

module.exports = {
  RegisterStudentValidation,
  updateStudentValidation,
  LoginUserValidation,
  updatePasswordValidation,
  StrongPasswordValidation,
  getStudentsValidation,
};
