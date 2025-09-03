const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const commentController = require('../controllers/comment');

// @route   POST /comments/:blogId
// @desc    Add a comment to a blog
// @access  Private
router.post('/:blogId', authMiddleware, commentController.addComment);

// @route   GET /comments/:blogId
// @desc    Get all comments for a blog
// @access  Public
router.get('/:blogId', commentController.getComments);

module.exports = router;