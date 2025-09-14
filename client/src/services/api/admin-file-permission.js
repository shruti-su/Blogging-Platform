// src/api/userService.js
import api from './../axiosConfig'; // Your Axios instance

// Base path for user-related endpoints
const USER_BASE_PATH = 'admin/';

const AdminService = {
  /**
   * Fetches all users.
   * @returns {Promise<Array>} A promise that resolves to an array of user objects.
   */
  getAllUsers: async () => {
    try {
      const response = await api.get(`${USER_BASE_PATH}users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Deletes a user by ID.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<Object>} The response from the API.
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`${USER_BASE_PATH}users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Updates a user's information by ID.
   * @param {string} userId - The ID of the user to update.
   * @param {Object} updatedData - The updated user data (name, email, role, etc.).
   * @returns {Promise<Object>} The updated user from the API.
   */
  updateUser: async (userId, updatedData) => {
    try {
      const response = await api.put(`${USER_BASE_PATH}users/${userId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  },
    /**
   * Fetches today's user login stats (logins per hour).
   * @returns {Promise<Array<number>>} Array of 24 numbers representing logins per hour.
   */
  getTodayLoginStats: async () => {
    try {
      const response = await api.get(`${USER_BASE_PATH}user-logins/today`);
      return response.data.logins; // Expecting: { logins: [0, 2, 5, ...] }
    } catch (error) {
      console.error('Error fetching today\'s login stats:', error);
      throw error;
    }
  },

  /**
   * Fetches all users with their corresponding blog counts.
   * @returns {Promise<Array>} A promise that resolves to an array of users with blog counts.
   */
  getUserBlogCounts: async () => {
    try {
      const response = await api.get(`${USER_BASE_PATH}user-blog-counts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user blog counts:", error);
      throw error;
    }
  },

};

export default AdminService;
