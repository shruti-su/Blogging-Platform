const Vote = require('../models/vote');

// Get vote counts for a blog and the current user's vote
exports.getVotes = async (req, res) => {
    const { blogId } = req.params;

    try {
        const likes = await Vote.countDocuments({ blog: blogId, type: 'like' });
        const dislikes = await Vote.countDocuments({ blog: blogId, type: 'dislike' });

        let userVote = null;
        // req.user is set by auth middleware
        if (req.user) {
            const vote = await Vote.findOne({ blog: blogId, user: req.user.id });
            if (vote) {
                userVote = vote.type;
            }
        }

        res.status(200).json({ likes, dislikes, userVote });
    } catch (err) {
        console.error('Error fetching votes:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handle a user's vote (like/dislike)
exports.handleVote = async (req, res) => {
    const { blogId } = req.params;
    const { type } = req.body; // 'like' or 'dislike'
    const userId = req.user.id;

    if (!['like', 'dislike'].includes(type)) {
        return res.status(400).json({ error: 'Invalid vote type.' });
    }

    try {
        const existingVote = await Vote.findOne({ blog: blogId, user: userId });

        if (existingVote) {
            // If the user is clicking the same vote type again, remove the vote (toggle off)
            if (existingVote.type === type) {
                await existingVote.deleteOne();
            } else {
                // If the user is changing their vote (e.g., from like to dislike)
                existingVote.type = type;
                await existingVote.save();
            }
        } else {
            // If no vote exists, create a new one
            const newVote = new Vote({ blog: blogId, user: userId, type: type });
            await newVote.save();
        }

        // After updating, fetch the new counts and return them
        const likes = await Vote.countDocuments({ blog: blogId, type: 'like' });
        const dislikes = await Vote.countDocuments({ blog: blogId, type: 'dislike' });

        const updatedUserVote = await Vote.findOne({ blog: blogId, user: userId });

        res.status(200).json({
            message: 'Vote updated successfully',
            likes,
            dislikes,
            userVote: updatedUserVote ? updatedUserVote.type : null,
        });
    } catch (err) {
        console.error('Error handling vote:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};