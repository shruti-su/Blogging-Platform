const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// All routes in this file are protected and require admin privileges.
// The `auth` middleware verifies the token, and the `admin` middleware checks the user's role.
router.use(auth, admin);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private, Admin
router.get('/users', adminController.getAllUsers);

// @route   DELETE api/admin/users/:userId
// @desc    Delete a user
// @access  Private, Admin
router.delete('/users/:userId', adminController.deleteUser);

// @route   PUT api/admin/users/:userId
// @desc    Update a user's role, name, etc.
// @access  Private, Admin
router.put('/users/:userId', adminController.updateUser);

// @route   GET api/admin/user-logins/today
// @desc    Get login statistics for today
// @access  Private, Admin
router.get('/user-logins/today', adminController.getTodayLoginStats);

// @route   GET api/admin/user-blog-counts
// @desc    Get all users with their blog counts
// @access  Private, Admin
router.get('/user-blog-counts', adminController.getUserBlogCounts);

module.exports = router;