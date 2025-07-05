const mongoose = require("mongoose");
const {
  subjects,
  user,
  boards,
  chapters,
  batches,
} = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      lowercase: true,
    },
    code: {
      type: String,
      uppercase: true,
      unique: true,
      required: true,
    },
    class: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    boardType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: boards,
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: batches,
      required: true,
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: chapters,
      },
    ],
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

const subjectModel = mongoose.model(subjects, ModelSchema);

module.exports = subjectModel;
