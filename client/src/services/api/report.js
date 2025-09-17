import api from "./../axiosConfig";

const API_URL = "/api/reports";

class ReportService {
  async createReport(reportData) {
    try {
      const response = await api.post(`${API_URL}/`, reportData);
      return response.data;
    } catch (error) {
      console.error(
        "API Error: Could not create report.",
        error.response?.data || error
      );
      throw error;
    }
  }

  // Admin function to get all reports
  async getReports() {
    try {
      const response = await api.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error(
        "API Error: Could not fetch reports.",
        error.response?.data || error
      );
      throw error;
    }
  }

  // Admin function to mark a report as seen
  async markReportAsSeen(reportId) {
    try {
      const response = await api.patch(`${API_URL}/${reportId}/seen`);
      return response.data;
    } catch (error) {
      console.error(
        `API Error: Could not mark report ${reportId} as seen.`,
        error.response?.data || error
      );
      throw error;
    }
  }

  // Admin function to delete a report
  async deleteReport(reportId) {
    try {
      const response = await api.delete(`${API_URL}/${reportId}`);
      return response.data;
    } catch (error) {
      console.error(
        `API Error: Could not delete report ${reportId}.`,
        error.response?.data || error
      );
      throw error;
    }
  }
}

export default new ReportService();