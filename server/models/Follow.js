const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    // The user who is following another user
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The user who is being followed
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent a user from following themselves
followSchema.pre('save', function(next) {
    if (this.follower.equals(this.following)) {
        return next(new Error('A user cannot follow themselves.'));
    }
    next();
});

// To prevent a user from following the same person more than once
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);