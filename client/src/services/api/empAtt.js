// src/api/userService.js
import api from './../axiosConfig'; // Import your configured Axios instance

// Base path for user-related endpoints
const USER_BASE_PATH = 'employee/att/';


const EmplyeeService = {
    getAllAttendence: async () => {
        try {
            const response = await api.get(`${USER_BASE_PATH}get`);
            return response.data; // Axios puts the actual data in .data
        } catch (error) {
            console.error('Error fetching all attendence records:', error);
            throw error; // Re-throw the error to be handled by the calling component
        }
    },
    setAttendence: async (attendenceData) => {
        try {
            const response = await api.post(`${USER_BASE_PATH}set`, attendenceData);
            return response.data; // Axios puts the actual data in .data
        } catch (error) {
            console.error('Error setting attendence record:', error);
            throw error; // Re-throw the error to be handled by the calling component
        }
    },
    /**
     * Fetches all users.
     * @returns {Promise<Array>} A promise that resolves to an array of user objects.
     */
    // getAllUsers: async () => {
    //     try {
    //         const response = await api.get(USER_BASE_PATH);
    //         return response.data; // Axios puts the actual data in .data
    //     } catch (error) {
    //         console.error('Error fetching all users:', error);
    //         throw error; // Re-throw the error to be handled by the calling component
    //     }
    // },

    // /**
    //  * Fetches a single user by ID.
    //  * @param {string} userId - The ID of the user to fetch.
    //  * @returns {Promise<Object>} A promise that resolves to a single user object.
    //  */
    // getUserById: async (userId) => {
    //     try {
    //         const response = await api.get(`${USER_BASE_PATH}/${userId}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error fetching user with ID ${userId}:`, error);
    //         throw error;
    //     }
    // },

    // /**
    //  * Creates a new user.
    //  * @param {Object} userData - The data for the new user (e.g., { name, email, password }).
    //  * @returns {Promise<Object>} A promise that resolves to the created user object.
    //  */
    // createUser: async (userData) => {
    //     try {
    //         const response = await api.post(USER_BASE_PATH, userData);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error creating user:', error);
    //         throw error;
    //     }
    // },

    // /**
    //  * Updates an existing user.
    //  * @param {string} userId - The ID of the user to update.
    //  * @param {Object} updatedData - The data to update the user with.
    //  * @returns {Promise<Object>} A promise that resolves to the updated user object.
    //  */
    // updateUser: async (userId, updatedData) => {
    //     try {
    //         const response = await api.put(`${USER_BASE_PATH}/${userId}`, updatedData);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error updating user with ID ${userId}:`, error);
    //         throw error;
    //     }
    // },

    // /**
    //  * Deletes a user by ID.
    //  * @param {string} userId - The ID of the user to delete.
    //  * @returns {Promise<Object>} A promise that resolves to a confirmation object.
    //  */
    // deleteUser: async (userId) => {
    //     try {
    //         const response = await api.delete(`${USER_BASE_PATH}/${userId}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error deleting user with ID ${userId}:`, error);
    //         throw error;
    //     }
    // },
};

export default EmplyeeService;