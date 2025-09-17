const Report = require("../models/Report");
const Blogs = require("../models/blogs");
const { validationResult, body } = require("express-validator");

/**
 * @route   POST /api/reports
 * @desc    Create a new report for a blog
 * @access  Private
 */
exports.createReport = [
  body("blogId", "Blog ID is required").not().isEmpty(),
  body("reason", "A reason for reporting is required").not().isEmpty().trim(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { blogId, reason } = req.body;
    const reporterId = req.user.id;

    try {
      // 1. Check if the blog exists
      const blog = await Blogs.findById(blogId);
      if (!blog) {
        return res.status(404).json({ msg: "Blog not found" });
      }

      // 2. Prevent users from reporting their own blog
      if (blog.author.toString() === reporterId) {
        return res.status(400).json({ msg: "You cannot report your own blog" });
      }

      // 3. Check if this user has already reported this blog
      const existingReport = await Report.findOne({
        blog: blogId,
        reporter: reporterId,
      });
      if (existingReport) {
        return res
          .status(400)
          .json({ msg: "You have already reported this blog" });
      }

      // 4. Create and save the new report
      const newReport = new Report({
        blog: blogId,
        reporter: reporterId,
        reason,
      });

      await newReport.save();

      res.status(201).json({ msg: "Blog reported successfully", report: newReport });
    } catch (err) {
      // Handle potential race condition for unique index
      if (err.code === 11000) {
        return res
          .status(400)
          .json({ msg: "You have already reported this blog" });
      }
      console.error("Error creating report:", err.message);
      res.status(500).send("Server Error");
    }
  },
];

/**
 * @route   GET /api/reports
 * @desc    Get all reports (Admin only)
 * @access  Private/Admin
 */
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: "blog",
        select: "blogTitle author",
        populate: {
          path: "author",
          select: "name email",
        },
      })
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @route   PATCH /api/reports/:reportId/seen
 * @desc    Mark a report as seen (Admin only)
 * @access  Private/Admin
 */
exports.markReportAsSeen = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      { seen: true },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ msg: "Report not found" });
    }

    res.json({ msg: "Report marked as seen", report });
  } catch (err) {
    console.error("Error updating report:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Report not found" });
    }
    res.status(500).send("Server Error");
  }
};

/**
 * @route   DELETE /api/reports/:reportId
 * @desc    Delete a report (Admin only)
 * @access  Private/Admin
 */
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ msg: "Report not found" });
    }

    await report.deleteOne();

    res.json({ msg: "Report deleted successfully" });
  } catch (err) {
    console.error("Error deleting report:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Report not found" });
    }
    res.status(500).send("Server Error");
  }
};