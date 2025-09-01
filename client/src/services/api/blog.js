// src/api/userService.js
import api from './../axiosConfig'; // Import your configured Axios instance

// Base path for user-related endpoints
const USER_BASE_PATH = 'blogs/';


const BlogService = {
    addBlog: async (blogData) => {
        try {
            const response = await api.post(`${USER_BASE_PATH}add`, blogData); // Adjust        
            return response.data; // Axios puts the actual data in .data
        } catch (error) {
            console.error('Error adding blog:', error);
            throw error; // Re-throw the error to be handled by the calling component
        }
    },
    updateBlog: async (blogId, blogData) => {
        try {
            // Assumes the update endpoint is 'blogs/update/:id'
            const response = await api.put(`${USER_BASE_PATH}update/${blogId}`, blogData);
            return response.data;
        } catch (error) {
            console.error(`Error updating blog with ID ${blogId}:`, error);
            throw error;
        }
    },
    getAllBlogs: async () => {
        try {
            const response = await api.get(`${USER_BASE_PATH}get`); // Adjust the endpoint as needed
            return response.data; // Axios puts the actual data in .data
        } catch (error) {
            console.error('Error fetching all blogs:', error);
            throw error; // Re-throw the error to be handled by the calling component   
        }
    },
    getBlogById: async (blogId) => {
        try {
            // Assumes the get endpoint is 'blogs/get/:id'
            const response = await api.get(`${USER_BASE_PATH}get/${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blog with ID ${blogId}:`, error);
            throw error;
        }
    },
    deleteBlog: async (blogId) => {
        try {
            // Assumes the delete endpoint is 'blogs/delete/:id'
            const response = await api.delete(`${USER_BASE_PATH}delete/${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting blog with ID ${blogId}:`, error);
            throw error;
        }
    }
};

export default BlogService