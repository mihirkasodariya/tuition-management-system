const mongoose = require("mongoose");
const { contactForms } = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    class: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    preferredTime: {
      type: String,
      enum: ["morning", "afternoon", "evening", "any"],
      default: "any",
    },
    heardAboutUs: {
      type: String,
      enum: [
        "friend",
        "social media",
        "newspaper",
        "flyer",
        "website",
        "other",
      ],
      default: "website",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "followup", "registered", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

const contactFormModel = mongoose.model(contactForms, ModelSchema);

module.exports = contactFormModel;
