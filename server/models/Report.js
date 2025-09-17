const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  // The blog that is being reported
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blogs",
    required: true,
  },
  // The user who reported the blog
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // The reason for the report
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  // Whether an admin has seen the report
  seen: {
    type: Boolean,
    default: false,
  },
  // Timestamp of when the report was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// To prevent a user from reporting the same blog multiple times
ReportSchema.index({ blog: 1, reporter: 1 }, { unique: true });

module.exports = mongoose.model("Report", ReportSchema);