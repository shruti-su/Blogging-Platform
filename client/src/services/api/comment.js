import api from './../axiosConfig';

const COMMENT_BASE_PATH = 'comments/';

const CommentService = {
    getComments: async (blogId) => {
        try {
            const response = await api.get(`${COMMENT_BASE_PATH}${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching comments for blog ${blogId}:`, error);
            throw error;
        }
    },

    postComment: async (blogId, content) => {
        try {
            const response = await api.post(`${COMMENT_BASE_PATH}${blogId}`, { content });
            return response.data;
        } catch (error) {
            console.error(`Error posting comment for blog ${blogId}:`, error);
            throw error;
        }
    },
};

export default CommentService;