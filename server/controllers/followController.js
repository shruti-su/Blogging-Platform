const Follow = require('../models/Follow');
const User = require('../models/User');

// @route   POST /api/users/:userId/follow
// @desc    Follow a user
// @access  Private
exports.followUser = async (req, res) => {
    try {
        const userIdToFollow = req.params.userId;
        const followerId = req.user.id; // Assuming user ID is available from auth middleware

        // Check if the user to follow exists
        const userToFollow = await User.findById(userIdToFollow);
        if (!userToFollow) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // The model's pre-save hook already prevents self-following, but we can check here too
        if (userIdToFollow === followerId) {
            return res.status(400).json({ msg: 'You cannot follow yourself' });
        }

        // The model's unique index will prevent duplicates, but this provides a clearer error
        const existingFollow = await Follow.findOne({ follower: followerId, following: userIdToFollow });
        if (existingFollow) {
            return res.status(400).json({ msg: 'You are already following this user' });
        }

        const newFollow = new Follow({
            follower: followerId,
            following: userIdToFollow,
        });

        await newFollow.save();

        res.json({ msg: 'Successfully followed user' });
    } catch (err) {
        // Handle unique index violation (duplicate follow)
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'You are already following this user' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/users/:userId/unfollow
// @desc    Unfollow a user
// @access  Private
exports.unfollowUser = async (req, res) => {
    try {
        const userIdToUnfollow = req.params.userId;
        const followerId = req.user.id; // Assuming user ID is available from auth middleware

        const result = await Follow.findOneAndDelete({
            follower: followerId,
            following: userIdToUnfollow,
        });

        if (!result) {
            return res.status(400).json({ msg: 'You are not following this user' });
        }

        res.json({ msg: 'Successfully unfollowed user' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/users/:userId/followers
// @desc    Get a user's followers
// @access  Public
exports.getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const followers = await Follow.find({ following: userId }).populate('follower', ['name', 'email']);

        res.json(followers.map(f => f.follower));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/users/:userId/following
// @desc    Get users a user is following
// @access  Public
exports.getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const following = await Follow.find({ follower: userId }).populate('following', ['name', 'email']);

        res.json(following.map(f => f.following));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/users/all
// @desc    Get all users except current user
// @access  Private
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};