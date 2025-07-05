const mongoose = require("mongoose");
const {
  subjects,
  user,
  batches,
  boards,
  enrollmentProgress,
  chapters,
} = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
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
    class: {
      type: Number,
      required: true,
    },
    subjects: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: subjects,
        },
        chapters: [
          {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: chapters,
              required: true,
            },
            subChapters: [],
            progress: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
    order: {
      type: Number,
      required: true,
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

const enrollmentProgressModel = mongoose.model(enrollmentProgress, ModelSchema);

module.exports = enrollmentProgressModel;
