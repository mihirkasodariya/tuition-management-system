const mongoose = require("mongoose");
const { agentChatMessages, user } = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    messages: [
      {
        content: {
          type: String,
        },
        role: {
          type: String,
          enum: ["user", "ai"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        metadata: mongoose.Schema.Types.Mixed,
        // history: mongoose.Schema.Types.Mixed,
      },
    ],
    history: mongoose.Schema.Types.Mixed,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      default: null,
    },
  },
  { timestamps: true }
);

const agentChatModel = mongoose.model(agentChatMessages, ModelSchema);

module.exports = agentChatModel;
