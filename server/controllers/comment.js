const Comment = require('../models/comment');
const { validationResult, body } = require('express-validator');

// Get all comments for a specific blog
exports.getComments = async (req, res) => {
    const { blogId } = req.params;

    try {
        const comments = await Comment.find({ blog: blogId })
            .populate('author', 'name') // Populate author's name
            .sort({ createdAt: 'desc' }); // Show newest comments first

        res.status(200).json({ comments });
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add a new comment to a blog
exports.addComment = [
    // Validation middleware
    body('content', 'Comment content cannot be empty').not().isEmpty().trim().escape(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { blogId } = req.params;
        const { content } = req.body;
        const authorId = req.user.id;

        try {
            const newComment = new Comment({
                blog: blogId,
                author: authorId,
                content: content,
            });

            await newComment.save();

            // Populate author details for the response
            const populatedComment = await Comment.findById(newComment._id).populate('author', 'name');

            res.status(201).json({ message: 'Comment added successfully', comment: populatedComment });
        } catch (err) {
            console.error('Error adding comment:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
];