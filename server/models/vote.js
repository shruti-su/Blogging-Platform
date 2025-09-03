const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogs',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['like', 'dislike'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure a user can only vote once (like or dislike) per blog post
voteSchema.index({ blog: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);