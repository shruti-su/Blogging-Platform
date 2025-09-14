const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");

// @route   POST /categories/add
// @desc    Add a new blog category
// @access  Private (requires auth)
router.post(
    "/add",
    auth,
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
    categoryController.getCategories
);

// @route   PUT /categories/:id
// @desc    Update a category
// @access  Private
router.put(
    "/:id",
    auth,
    [
        check("name", "Category name is required").not().isEmpty(),
    ],
    categoryController.updateCategory
);

// @route   DELETE /categories/:id
// @desc    Delete a category
// @access  Private
router.delete(
    "/:id",
    auth,
    categoryController.deleteCategory
);

module.exports = router;