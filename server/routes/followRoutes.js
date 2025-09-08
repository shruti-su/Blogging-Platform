const express = require('express');
const router = express.Router();
const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getAllUsers,
} = require('../controllers/followController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/users/:userId/follow
// @desc    Follow a user
// @access  Private
router.post('/:userId/follow', auth, followUser);

// @route   DELETE api/users/:userId/unfollow
// @desc    Unfollow a user
// @access  Private
router.delete('/:userId/unfollow', auth, unfollowUser);

// @route   GET api/users/:userId/followers
router.get('/:userId/followers', getFollowers);

// @route   GET api/users/:userId/following
router.get('/:userId/following', getFollowing);

// @route   GET api/users/all
// @desc    Get all users except current user
router.get('/all', auth, getAllUsers);

module.exports = router;