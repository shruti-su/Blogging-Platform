const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const { check } = require("express-validator");

// const auth = require("../middleware/authMiddleware");

// @route   POST /categories/add
// @desc    Add a new blog category
// @access  Private (requires auth)
router.post(
    "/add",
    // auth,
    [
        check("name", "Category name is required").not().isEmpty(),
    ],
    categoryController.addCategory
);

// @route   GET /categories/get
// @desc    Get all blog categories
// @access  Public/Private
router.get(
    "/get",
    // auth,
    categoryController.getCategories
);

module.exports = router;