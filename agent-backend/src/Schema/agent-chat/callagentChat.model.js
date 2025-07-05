const mongoose = require("mongoose");
const { callAgentChatMessages } = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    sid: {
      type: String,
      unique: true,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    callDetails: mongoose.Schema.Types.Mixed,
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
      },
    ],
    history: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const callAgentChatModel = mongoose.model(callAgentChatMessages, ModelSchema);

module.exports = callAgentChatModel;
