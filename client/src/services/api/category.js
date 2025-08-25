// src/api/userService.js
import api from './../axiosConfig'; // Import your configured Axios instance

// Base path for user-related endpoints
const USER_BASE_PATH = 'categories/';


const CategoryService = {
    getAllCategories: async () => {
        try {
            const response = await api.get(`${USER_BASE_PATH}get`); // Adjust the endpoint as needed
            return response.data; // Axios puts the actual data in .data
        } catch (error) {
            console.error('Error fetching all categories:', error);
            throw error; // Re-throw the error to be handled by the calling component
        }
    },
        addCategory: async (categoryData) => {      
        try {
            const response = await api.post(`${USER_BASE_PATH}add`, categoryData); // Adjust the endpoint as needed
            return response.data; // Axios puts the actual data in .data
        } catch (error) {
            console.error('Error adding category:', error);
            throw error; // Re-throw the error to be handled by the calling component
        }
    },
    
};

export default CategoryService ;