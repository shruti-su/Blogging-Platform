import api from './../axiosConfig';

const VOTE_BASE_PATH = 'votes/';

const VoteService = {
    getVotes: async (blogId) => {
        try {
            const response = await api.get(`${VOTE_BASE_PATH}${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching votes for blog ${blogId}:`, error);
            throw error;
        }
    },

    castVote: async (blogId, voteType) => {
        try {
            const response = await api.post(`${VOTE_BASE_PATH}${blogId}`, { type: voteType });
            return response.data;
        } catch (error) {
            console.error(`Error casting vote for blog ${blogId}:`, error);
            throw error;
        }
    },
};

export default VoteService;