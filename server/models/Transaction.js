const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "Payment",
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Safe", "Review"],
      default: "Review",
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },

    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    warnings: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);