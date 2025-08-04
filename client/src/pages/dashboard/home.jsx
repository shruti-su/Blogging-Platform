import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Typography,
  IconButton,
  Button,
  Input,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import fileuploadService from "/src/services/api/fileupload.js";
import { sweetAlert } from "../../components/SweetAlert/SweetAlert";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/context/ThemeContext";
import TiltedCard from "@/components/Tilted-card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getRecentUploads = async () => {
  try {
    const data = await fileuploadService.getFileRecords();
    if (!Array.isArray(data) || data.length === 0) return [];
    return [...data].slice(0, 5);
  } catch (error) {
    console.error("Error fetching recent uploads:", error);
    return [];
  }
};

function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { showSuccess, showError, showWarning, showConfirm } = sweetAlert();

  const [totalFilesUploaded, setTotalFilesUploaded] = useState(0);
  const [totalRowsImported, setTotalRowsImported] = useState(0);
  const [chartsCreated, setChartsCreated] = useState(0);
  const [lastUploadDate, setLastUploadDate] = useState("N/A");
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const countResponse = await fileuploadService.getCount();
      if (countResponse && typeof countResponse.count === "number") {
        setTotalFilesUploaded(countResponse.count);
      } else {
        setTotalFilesUploaded(0);
      }

      const lastUploadResponse = await fileuploadService.getLastUpload();
      if (lastUploadResponse && lastUploadResponse.lastUploadedAt) {
        setLastUploadDate(
          new Date(lastUploadResponse.lastUploadedAt).toLocaleString()
        );
      } else {
        setLastUploadDate("No uploads yet");
      }

      const recent = await getRecentUploads();
      setRecentUploads(recent);

      const totalRows = recent.reduce(
        (sum, file) => sum + (file.rowCount || 0),
        0
      );
      const totalCharts = recent.reduce(
        (sum, file) => sum + (file.chartCount || 0),
        0
      );
      setTotalRowsImported(totalRows);
      setChartsCreated(totalCharts);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (recordId, fileName) => {
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await fileuploadService.deleteFileRecord(recordId);
      showSuccess(`File "${fileName}" deleted successfully!`);
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
      showError(`Failed to delete "${fileName}". Please try again.`);
    }
  };

  const handleAnalyse = async (file) => {
    const confirmed = await showConfirm(
      `Do you want to analyze "${file.fileName}"?`
    );
    if (!confirmed) return;

    try {
      const response = await fileuploadService.getFileData(file._id);
      if (response && response.data) {
        navigate("/dashboard/charts", {
          state: { parsedData: response.data, fileName: file.fileName },
        });
      } else {
        showError(
          "No data found for analysis. Please ensure the file contains valid data."
        );
      }
    } catch (err) {
      console.error("Error fetching data for analysis:", err);
      showError("Failed to fetch file data for analysis. Please try again.");
    }
  };

  const handleDownload = (fileId, fileName) => {
    showWarning(
      `Download functionality for "${fileName}" not yet implemented.`
    );
    console.log("Download file with ID:", fileId);
  };

  const filteredRecentUploads = recentUploads.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = theme === "dark";

  const sampleChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Uploads",
        data: [2, 4, 3, 6, 5],
        backgroundColor: isDark
          ? "#0d2459"
          : "#102f75", // indigo-600
        borderColor: isDark ? "#F6F5F2" : "#4f46e5", // primary or indigo-600
        pointBackgroundColor: isDark ? "#222831" : "#F6F5F2", // primary-dark or primary
        pointBorderColor: isDark ? "#F6F5F2" : "#222831",
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#F6F5F2" : "#222831", // legend text color
        },
      },
      title: {
        color: isDark ? "#F6F5F2" : "#222831",
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: isDark ? "#F6F5F2" : "#222831",
        },
      },
      y: {
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: isDark ? "#F6F5F2" : "#222831",
        },
      },
    },
  };

  return (
    <div className="min-h-screen p-6 space-y-6 from-purple-50 to-indigo-100 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 border border-indigo-200 shadow-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 rounded-xl dark:border-gray-600"
      >
        <Typography
          variant="h4"
          className="font-bold text-indigo-900 dark:text-white"
        >
          👋 Welcome back!
        </Typography>
        <Typography className="text-lg text-indigo-800 dark:text-gray-300">
          Here's your dashboard overview at a glance.
        </Typography>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 text-white bg-indigo-600 shadow-md rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:rotate-x-5 hover:rotate-y-5">
          <Typography variant="h6">Files Uploaded</Typography>
          <Typography variant="h3">{totalFilesUploaded}</Typography>
        </Card>

        <Card className="p-4 text-white bg-blue-600 shadow-md rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:rotate-x-5 hover:rotate-y-5">
          <Typography variant="h6">Data Rows</Typography>
          <Typography variant="h3">{totalRowsImported}</Typography>
        </Card>

        <Card className="p-4 text-white bg-green-600 shadow-md rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:rotate-x-5 hover:rotate-y-5">
          <Typography variant="h6">Charts Created</Typography>
          <Typography variant="h3">{chartsCreated}</Typography>
        </Card>

        <Card className="p-4 text-white bg-yellow-600 shadow-md rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:rotate-x-5 hover:rotate-y-5">
          <Typography variant="h6">Last Upload</Typography>
          <Typography variant="h5">{lastUploadDate}</Typography>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-md dark:bg-gray-900">
          <Typography variant="h6" className="dark:text-white">
            Top Visualizations
          </Typography>
          <Line data={sampleChartData} options={chartOptions} />
        </Card>
        <Card className="p-6 shadow-md dark:bg-gray-900">
          <Typography variant="h6" className="dark:text-white">
            Recent Activity
          </Typography>
          <Bar data={sampleChartData} options={chartOptions} />
        </Card>
      </div>

      {/* File Table */}
      <Card className="p-6 mt-6 shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="dark:text-white">
            Recent Uploads
          </Typography>
          <div className="w-full md:w-72">
            <Input
              placeholder="Search files or visualizations..."
              className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 dark:text-black dark:!border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-400 dark:focus:!border-white dark:focus:!border-t-white"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "min-w-[100px]",
              }}
              // The search icon is added here
              icon={<MagnifyingGlassIcon className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-2">File Name</th>
                <th className="p-2">Upload Date</th>
                <th className="p-2">Rows Imported</th>
                <th className="p-2">Charts</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecentUploads.length > 0 ? (
                filteredRecentUploads.map((file, index) => (
                  <tr
                    key={file._id || index}
                    className="border-b dark:border-gray-600 dark:text-white"
                  >
                    <td className="p-2">{file.fileName}</td>
                    <td className="p-2">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">{file.rowCount || 0}</td>
                    <td className="p-2">{file.chartCount || 0}</td>
                    <td className="p-2 space-x-2">
                      <Button onClick={() => handleAnalyse(file)} size="sm">
                        Analyze
                      </Button>
                      <Button
                        onClick={() => handleDelete(file._id, file.fileName)}
                        color="red"
                        size="sm"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleDownload(file._id, file.fileName)}
                        size="sm"
                        variant="outlined"
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchQuery
                      ? "No matching files found."
                      : "No uploads yet. Upload your first file to see it here!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Home;