const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware"); // Assuming this middleware exists
const admin = require("../middleware/adminMiddleware"); // Assuming this middleware exists
const reportController = require("../controllers/reportController");

// @route   POST api/reports
// @desc    Create a new report for a blog
// @access  Private
router.post("/", auth, reportController.createReport);

// @route   GET api/reports
// @desc    Get all reports
// @access  Private/Admin
router.get("/", [auth, admin], reportController.getReports);

// @route   PATCH api/reports/:reportId/seen
// @desc    Mark a report as seen
// @access  Private/Admin
router.patch(
  "/:reportId/seen",
  [auth, admin],
  reportController.markReportAsSeen
);

// @route   DELETE api/reports/:reportId
// @desc    Delete a report
// @access  Private/Admin
router.delete("/:reportId", [auth, admin], reportController.deleteReport);

module.exports = router;