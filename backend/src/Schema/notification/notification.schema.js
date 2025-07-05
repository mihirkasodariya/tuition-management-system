const mongoose = require("mongoose");
const { notifications, user } = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      default: null,
    },

    category: {
      type: String,
      enum: ["primary", "warning", "success", "danger", "info"],
      default: "primary",
    },
    type: {
      type: String,
      enum: ["contact_form", "custom", "google_meet_cron", "home_work"],
      default: "custom",
    },

    recipientType: {
      type: String,
      enum: ["admin", "student", "both"],
      required: true,
    },

    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      //   default: null
    },

    isRead: {
      type: Boolean,
      default: false,
    },
    // expiresAt: {
    //   type: Date,
    //   default: () => Date.now() + 2 * 24 * 60 * 60 * 1000, //after 2days
    //   index: { expires: 0 },
    // },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model(notifications, ModelSchema);

module.exports = notificationModel;
