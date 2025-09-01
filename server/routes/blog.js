const express = require("express");
const router = express.Router();
const blog = require("../controllers/blog");
const { check } = require("express-validator");

const auth = require("../middleware/authMiddleware");


router.post(
    "/add",
    // auth,
    [
        // Validation checks
        check("blogType", "Blog type is required").not().isEmpty(),
        check("blogTitle", "Blog title is required").not().isEmpty(),
        check("blogSubTitle", "Blog sub title is required").not().isEmpty(),
        check("blogContent", "Blog content is required").not().isEmpty(),
    ],
    blog.addblog
);

// 📋 [GET] List all students
router.get(
    "/get",
    // auth,
    blog.getblog
);

// @route   GET /blogs/get/:id
// @desc    Get a single blog by ID
// @access  Public
router.get(
    "/get/:id",
    auth,
    blog.getBlogById
);

// @route   PUT /blogs/update/:id
// @desc    Update an existing blog
// @access  Private (add auth middleware)
router.put(
    "/update/:id",
    auth,
    blog.updateBlog
);

// @route   DELETE /blogs/delete/:id
// @desc    Delete a blog
// @access  Private (add auth middleware)
router.delete(
    "/delete/:id",
    auth,
    blog.deleteBlog
);
// router.post("/google-login", authcontroller.googleLogin);
// router.post("/forgot-password", authcontroller.forgotPassword);
// router.post("/verify-otp", authcontroller.verifyOtp);

// // router.post("/forgot-password", authcontroller.forgotPassword);
// router.post("/reset-password", authcontroller.resetPassword);

module.exports = router;
