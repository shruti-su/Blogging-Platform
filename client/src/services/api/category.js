// src/services/api/category.js
import api from './../axiosConfig';

// Base path for user-related endpoints
const CATEGORY_BASE_PATH = 'categories/';

const CategoryService = {
    getAllCategories: async () => {
        try {
            const response = await api.get(`${CATEGORY_BASE_PATH}get`);
            return response.data;
        } catch (error) {
            console.error('API Error: Could not fetch all categories.', error);
            throw error;
        }
    },
    addCategory: async (categoryData) => {
        try {
            const response = await api.post(`${CATEGORY_BASE_PATH}add`, categoryData);
            return response.data;
        } catch (error) {
            console.error('API Error: Could not add category.', error);
            throw error;
        }
    },
    updateCategory: async (categoryId, categoryData) => {
        try {
            // Assuming a PUT endpoint like /api/categories/:id
            const response = await api.put(`${CATEGORY_BASE_PATH}${categoryId}`, categoryData);
            return response.data;
        } catch (error) {
            console.error(`API Error: Could not update category with ID ${categoryId}.`, error);
            throw error;
        }
    },
    deleteCategory: async (categoryId) => {
        try {
            // Assuming a DELETE endpoint like /api/categories/:id
            const response = await api.delete(`${CATEGORY_BASE_PATH}${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`API Error: Could not delete category with ID ${categoryId}.`, error);
            throw error;
        }
    }

};

export default CategoryService;