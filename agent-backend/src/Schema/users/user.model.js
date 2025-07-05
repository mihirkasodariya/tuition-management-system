const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { STUDENT, ADMIN } = require("../../Constants/roles.constants");
const { user, boards } = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minimum: 8,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    class: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    school: {
      type: String,
      required: true,
    },
    boardType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: boards,
      required: true,
    },
    role: {
      type: String,
      default: STUDENT,
      enum: [ADMIN, STUDENT],
    },
    timings: {
      start: {
        type: Date,
        required: true,
      },
      startTimeHHMM: {
        type: String,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      endTimeHHMM: {
        type: String,
        required: true,
      },
    },
    days: {
      monday: {
        type: Boolean,
        default: false,
      },
      tuesday: {
        type: Boolean,
        default: false,
      },
      wednesday: {
        type: Boolean,
        default: false,
      },
      thursday: {
        type: Boolean,
        default: false,
      },
      friday: {
        type: Boolean,
        default: false,
      },
      saturday: {
        type: Boolean,
        default: false,
      },
      sunday: {
        type: Boolean,
        default: false,
      },
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    google: {
      isConnected: {
        type: Boolean,
        default: false,
      },
      profileDetails: {
        type: Object,
      },
      tokens: {
        type: Object,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
  },
  { timestamps: true }
);

ModelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

const userModel = mongoose.model(user, ModelSchema);

module.exports = userModel;
