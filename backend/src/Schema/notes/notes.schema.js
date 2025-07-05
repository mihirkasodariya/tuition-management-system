const mongoose = require("mongoose");
const { user, notes } = require("../../Constants/model.constants");

const subBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["text", "editor", "button", "video", "divider", "image"],
  },
  label: { type: String },
  content: { type: String },
  videoUrl: { type: String },
  imageUrl: { type: String },
  styleClass: { type: String },
  style: { type: mongoose.Schema.Types.Mixed },
  outerStyle: { type: mongoose.Schema.Types.Mixed },
  uuid: { type: String, required: true },
});

const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  blockStyleClassName: { type: String },
  blockStyles: { type: mongoose.Schema.Types.Mixed },
  subBlock: { type: [subBlockSchema] },
  uuid: { type: String, required: true },
});

const columnSchema = new mongoose.Schema({
  type: { type: String, enum: ["column", "row"] },
  styleClassName: { type: String },
  styles: { type: mongoose.Schema.Types.Mixed },
  properties: {
    containerType: { type: String },
    columns: { type: Number },
  },
  block: { type: [blockSchema] },
  uuid: { type: String, required: true },
});

const ModelSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    templateSections: [columnSchema],
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

const notesModel = mongoose.model(notes, ModelSchema);

module.exports = notesModel;
