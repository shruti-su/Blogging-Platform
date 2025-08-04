import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import AdminService from "@/services/api/admin-file-permission";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

function AdminHome() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    AdminService.getTodayLoginStats()
      .then((logins) => {
        setChartData({
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          datasets: [
            {
              label: "Today's Logins (Per Hour)",
              data: logins,
              borderColor: "rgba(79, 70, 229, 1)", // Indigo-600
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
      })
      .catch((err) => console.error("Error loading login stats:", err));
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: "Login Count" },
      },
      x: {
        title: { display: true, text: "Hour" },
      },
    },
  };

  return (
    <div className="p-6 space-y-8">
      <Typography variant="h4" className="text-indigo-700 font-bold">
        Admin Dashboard
      </Typography>

      <Card className="shadow-lg rounded-xl">
        <CardHeader floated={false} shadow={false} className="bg-indigo-50 px-6 py-4">
          <Typography variant="h6" className="text-indigo-600">
            Today's User Logins (Hourly View)
          </Typography>
        </CardHeader>
        <CardBody className="px-6 py-4">
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Typography color="gray" className="text-sm">
              Loading login statistics...
            </Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default AdminHome;
