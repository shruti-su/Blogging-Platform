const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const voteController = require('../controllers/vote');

// @route   POST /votes/:blogId
// @desc    Cast or update a vote on a blog
// @access  Private
router.post('/:blogId', authMiddleware, voteController.handleVote);

// @route   GET /votes/:blogId
// @desc    Get vote counts for a blog and the user's vote status
// @access  Private (to know user's vote)
router.get('/:blogId', authMiddleware, voteController.getVotes);

module.exports = router;