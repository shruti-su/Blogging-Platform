import api from "./../axiosConfig";

const USER_BASE_PATH = "users/";

const followService = {
  followUser: async (userId) => {
    try {
      const response = await api.post(`${USER_BASE_PATH}${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error(`API Error: Could not follow user with ID ${userId}.`, error);
      throw error;
    }
  },

  unfollowUser: async (userId) => {
    try {
      const response = await api.delete(`${USER_BASE_PATH}${userId}/unfollow`);
      return response.data;
    } catch (error) {
      console.error(`API Error: Could not unfollow user with ID ${userId}.`, error);
      throw error;
    }
  },

  getFollowers: async (userId) => {
    try {
      const response = await api.get(`${USER_BASE_PATH}${userId}/followers`);
      return response.data;
    } catch (error) {
      console.error(`API Error: Could not fetch followers for user with ID ${userId}.`, error);
      throw error;
    }
  },

  getFollowing: async (userId) => {
    try {
      const response = await api.get(`${USER_BASE_PATH}${userId}/following`);
      return response.data;
    } catch (error) {
      console.error(`API Error: Could not fetch following for user with ID ${userId}.`, error);
      throw error;
    }
  },
};

export default followService;