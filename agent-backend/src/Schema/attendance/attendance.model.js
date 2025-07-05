const mongoose = require("mongoose");
const {
  batches,
  user,
  attendances,
  boards,
  subjects,
  chapters,
  enrollmentProgress,
} = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    day: {
      type: String,
      required: true,
      lowercase: true,
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
    class: {
      type: Number,
      required: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: enrollmentProgress,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: subjects,
    },
    progress: {
      chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: chapters,
      },
      subChapterId: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: batches,
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: boards,
      required: true,
    },
    googleMeet: {
      meetLink: {
        type: String,
      },
      conferenceId: {
        type: String,
      },
      details: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
  },
  { timestamps: true }
);

const attendanceModel = mongoose.model(attendances, ModelSchema);

module.exports = attendanceModel;
