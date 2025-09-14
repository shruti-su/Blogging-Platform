// src/services/api/blog.js
import api from './../axiosConfig';

// Base path for blog-related endpoints
const BLOG_BASE_PATH = 'blogs/';

const BlogService = {
    getFeedBlogs: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`${BLOG_BASE_PATH}feed`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('API Error: Could not fetch feed blogs.', error);
            throw error;
        }
    },
    addBlog: async (blogData) => {
        try {
            const response = await api.post(`${BLOG_BASE_PATH}add`, blogData);
            return response.data;
        } catch (error) {
            console.error('API Error: Could not add blog.', error);
            throw error;
        }
    },
    updateBlog: async (blogId, blogData) => {
        try {
            const response = await api.put(`${BLOG_BASE_PATH}update/${blogId}`, blogData);
            return response.data;
        } catch (error) {
            console.error(`API Error: Could not update blog with ID ${blogId}.`, error);
            throw error;
        }
    },
    getAllBlogs: async () => {
        try {
            const response = await api.get(`${BLOG_BASE_PATH}get`);
            return response.data;
        } catch (error) {
            console.error('API Error: Could not fetch all blogs.', error);
            throw error;
        }
    },
    getUserBlogs: async () => {
        try {
            const response = await api.get(`${BLOG_BASE_PATH}userBlogs`);
            return response.data;
        } catch (error) {
            console.error('API Error: Could not fetch user blogs.', error);
            throw error;
        }
    },
    getBlogsByUserId: async (userId) => {
        try {
            const response = await api.get(`${BLOG_BASE_PATH}user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(
                `API Error: Could not fetch blogs for user ${userId}.`,
                error
            );
            throw error;
        }
    },
    getBlogById: async (blogId) => {
        try {
            const response = await api.get(`${BLOG_BASE_PATH}get/${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`API Error: Could not fetch blog with ID ${blogId}.`, error);
            throw error;
        }
    },
    deleteBlog: async (blogId) => {
        try {
            const response = await api.delete(`${BLOG_BASE_PATH}delete/${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`API Error: Could not delete blog with ID ${blogId}.`, error);
            throw error;
        }
    }
};

export default BlogService