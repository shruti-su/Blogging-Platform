const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog");
const { check } = require("express-validator");

const auth = require("../middleware/authMiddleware");

// Reusable validation rules for creating/updating a blog
const blogValidationRules = [
    check("blogType", "Blog type is required").not().isEmpty(),
    check("blogTitle", "Blog title is required").not().isEmpty(),
    check("blogSubTitle", "Blog sub title is required").not().isEmpty(),
    check("blogContent", "Blog content is required").not().isEmpty(),
];

// @route   POST /blogs/add
// @desc    Add a new blog
// @access  Private
router.post(
    "/add",
    auth,
    blogValidationRules,
    blogController.addBlog
);

// @route   GET /blogs/get
// @desc    Get all blogs
// @access  Public
router.get(
    "/get",
    blogController.getAllBlogs
);

// @route   GET /blogs/feed
// @desc    Get blogs from followed users for the feed
// @access  Private
router.get(
    "/feed",
    auth,
    blogController.getFeedBlogs
);
// @route   GET /blogs/user
// @desc    Get all blogs for the logged-in user
// @access  Private
router.get(
    "/userBlogs",
    auth,
    blogController.getUserBlogs
);
// @route   GET /blogs/user/:userId
// @desc    Get all blogs for a specific user
// @access  Public
router.get(
    "/user/:userId",
    blogController.getBlogsByUserId
);
// @route   GET /blogs/get/:id
// @desc    Get a single blog by ID
// @access  Public
router.get(
    "/get/:id",
    blogController.getBlogById
);

// @route   PUT /blogs/update/:id
// @desc    Update an existing blog
// @access  Private
router.put(
    "/update/:id",
    auth,
    blogValidationRules, // <-- FIX: Added validation middleware
    blogController.updateBlog
);

// @route   DELETE /blogs/delete/:id
// @desc    Delete a blog
// @access  Private (add auth middleware)
router.delete(
    "/delete/:id",
    auth,
    blogController.deleteBlog
);

module.exports = router;
