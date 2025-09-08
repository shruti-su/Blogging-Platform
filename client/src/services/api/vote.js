import api from "./../axiosConfig";

// Base path for vote-related endpoints
const VOTE_BASE_PATH = "votes/";

const VoteService = {
    /**
     * Fetches vote counts and the current user's vote for a specific blog.
     * @param {string} blogId - The ID of the blog.
     * @returns {Promise<Object>} A promise that resolves to an object with likes, dislikes, and userVote.
     */
    getVotes: async (blogId) => {
        try {
            const response = await api.get(`${VOTE_BASE_PATH}${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`API Error: Could not fetch votes for blog ${blogId}.`, error);
            throw error;
        }
    },

    /**
     * Casts or updates a user's vote on a blog.
     * @param {string} blogId - The ID of the blog to vote on.
     * @param {string} voteType - The type of vote ('like' or 'dislike').
     * @returns {Promise<Object>} A promise that resolves to the updated vote counts and user vote status.
     */
    castVote: async (blogId, voteType) => {
        try {
            const response = await api.post(`${VOTE_BASE_PATH}${blogId}`, { type: voteType });
            return response.data;
        } catch (error) {
            console.error(`API Error: Could not cast vote for blog ${blogId}.`, error);
            throw error;
        }
    },
};

export default VoteService;