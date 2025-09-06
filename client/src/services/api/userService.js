import api from "./../axiosConfig";

const USER_BASE_PATH = "users/";

const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get(`${USER_BASE_PATH}all`);
      return response.data;
    } catch (error) {
      console.error("API Error: Could not fetch all users.", error);
      throw error;
    }
  },
};

export default userService;