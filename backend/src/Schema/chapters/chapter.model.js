const mongoose = require("mongoose");
const {
  subjects,
  user,
  chapters,
  batches,
} = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    content: {
      type: String,
      lowercase: true,
    },
    imageURL: {
      type: String,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: subjects,
      required: true,
    },
    subChapters: [
      {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
        },
        imageURL: {
          type: String,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    order: {
      type: Number,
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: batches,
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

const chapterModel = mongoose.model(chapters, ModelSchema);

module.exports = chapterModel;
