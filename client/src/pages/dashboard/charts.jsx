import React, { useState, useEffect, useCallback, useRef } from "react";
import { MultiSelect } from "primereact/multiselect";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Pie,
  Bar,
  Line,
  Doughnut,
  Radar,
  PolarArea,
  Scatter,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Title, // Added Title for chart options
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Title // Register Title
);

export const Charts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedData = location.state?.parsedData || [];

  // State for chart selection and data processing
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [showChartWithData, setShowChartWithData] = useState(false);
  const [dynamicChartData, setDynamicChartData] = useState(null);
  const chartRef = useRef(null); // Ref for dynamic chart

  // --- Data Validation and Early Exit ---
  useEffect(() => {
    console.log("Parsed Data:", parsedData);
    // Reset states if parsedData changes (e.g., navigating back from upload)
    setSelectedHeaders([]);
    setSelectedChart(null);
    setShowChartWithData(false);
    setDynamicChartData(null);
  }, [parsedData]); // Re-run when parsedData changes

  if (!parsedData.length) {
    return (
      <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl border-indigo-200 min-h-screen">
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          No data available. Please upload a file first.
        </h2>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/dashboard/upload")}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 font-semibold"
          >
            ← Go to Upload
          </button>
        </div>
      </div>
    );
  } else if (parsedData.length === 1) {
    // Only headers, no data rows
    return (
      <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl border-indigo-200 min-h-screen">
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          No data rows found. Please upload a file with more data.
        </h2>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/dashboard/upload")}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 font-semibold"
          >
            ← Go to Upload
          </button>
        </div>
      </div>
    );
  } else if (parsedData.length > 1000) {
    return (
      <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl border-indigo-200 min-h-screen">
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Too much data to display charts. Please upload a smaller file.
        </h2>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/dashboard/upload")}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 font-semibold"
          >
            ← Go to Upload
          </button>
        </div>
      </div>
    );
  }

  // Extract headers from parsedData for MultiSelect options
  const headers = Array.isArray(parsedData[0]) ? parsedData[0] : [];
  const dataRows = parsedData.slice(1); // All rows except the first (headers)

  const headerOptions = headers.map((header) => ({
    name: header,
    code: header,
  }));

  // --- Chart Data Generation Logic ---
  const generateChartData = useCallback(() => {
    // Added useCallback
    if (!selectedHeaders.length || !selectedChart) {
      setDynamicChartData(null);
      return;
    }

    const datasets = [];
    const labels = [];
    let chartOptions = {};

    // Get the indices of the selected headers
    const selectedHeaderIndices = selectedHeaders.map((header) =>
      headers.indexOf(header.name)
    );

    // Filter out invalid indices (headers not found)
    const validSelectedHeaderIndices = selectedHeaderIndices.filter(
      (idx) => idx !== -1
    );

    if (validSelectedHeaderIndices.length === 0) {
      setDynamicChartData(null);
      return;
    }

    // Assign colors for datasets
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#a8a29e",
      "#60a5fa",
      "#f472b6",
    ];

    // --- Logic for different chart types ---
    if (
      selectedChart === "Pie Chart" ||
      selectedChart === "Doughnut Chart" ||
      selectedChart === "Polar Area Chart"
    ) {
      if (validSelectedHeaderIndices.length === 1) {
        // For pie/doughnut/polar, one column for labels, one for data (or aggregate)
        // Simplification: Assume the selected column contains categorical data to count
        const counts = {};
        dataRows.forEach((row) => {
          const value = row[validSelectedHeaderIndices[0]];
          if (value !== undefined && value !== null) {
            counts[value] = (counts[value] || 0) + 1;
          }
        });

        labels.push(...Object.keys(counts));
        datasets.push({
          data: Object.values(counts),
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        });
        chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `${selectedChart} of ${selectedHeaders[0].name}`,
            },
          },
        };
      } else if (validSelectedHeaderIndices.length >= 2) {
        // Assume first selected is labels, second is data
        const labelColIndex = validSelectedHeaderIndices[0];
        const dataColIndex = validSelectedHeaderIndices[1];

        dataRows.forEach((row) => {
          const labelValue = row[labelColIndex];
          const dataValue = parseFloat(row[dataColIndex]);
          if (labelValue !== undefined && !isNaN(dataValue)) {
            labels.push(labelValue);
            datasets.push(dataValue); // For pie, data is directly in dataset
          }
        });

        datasets.push({
          data: datasets, // This is a bit of a hack for pie/doughnut/polar
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        });
        chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `${selectedChart} of ${selectedHeaders[1].name} by ${selectedHeaders[0].name}`,
            },
          },
        };
      }
    } else if (
      selectedChart === "Bar Chart" ||
      selectedChart === "Column Chart" ||
      selectedChart === "Histogram"
    ) {
      if (validSelectedHeaderIndices.length >= 1) {
        const labelColIndex = validSelectedHeaderIndices[0];
        labels.push(...dataRows.map((row) => row[labelColIndex]));

        if (validSelectedHeaderIndices.length === 1) {
          // If only one column selected, assume it's data, labels are just indices
          // Or, if it's a histogram, aggregate counts.
          // For simplicity, let's just count occurrences for histogram-like behavior
          const counts = {};
          dataRows.forEach((row) => {
            const value = row[labelColIndex];
            if (value !== undefined && value !== null) {
              counts[value] = (counts[value] || 0) + 1;
            }
          });
          labels.splice(0, labels.length, ...Object.keys(counts)); // Replace labels
          datasets.push({
            label: selectedHeaders[0].name,
            data: Object.values(counts),
            backgroundColor: colors[0],
            borderColor: colors[0],
            borderWidth: 1,
            barPercentage: selectedChart === "Histogram" ? 1.0 : 0.9, // Full width for histogram
            categoryPercentage: selectedChart === "Histogram" ? 1.0 : 0.9,
          });
        } else {
          // Multiple columns: first is labels, others are datasets
          for (let i = 1; i < validSelectedHeaderIndices.length; i++) {
            const dataColIndex = validSelectedHeaderIndices[i];
            datasets.push({
              label: selectedHeaders[i].name,
              data: dataRows
                .map((row) => parseFloat(row[dataColIndex]))
                .filter((val) => !isNaN(val)),
              backgroundColor: colors[(i - 1) % colors.length],
              borderColor: colors[(i - 1) % colors.length],
              borderWidth: 1,
            });
          }
        }
        chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `${selectedChart} of ${selectedHeaders
                .map((h) => h.name)
                .join(", ")}`,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: selectedHeaders[0].name,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Value / Frequency",
              },
            },
          },
        };
        if (selectedChart === "Column Chart") {
          chartOptions.indexAxis = "y"; // Horizontal bar chart
          // Swap x and y axis titles if needed for clarity
          const temp = chartOptions.scales.x.title.text;
          chartOptions.scales.x.title.text = chartOptions.scales.y.title.text;
          chartOptions.scales.y.title.text = temp;
        }
      }
    } else if (
      selectedChart === "Line Chart" ||
      selectedChart === "Area Chart" ||
      selectedChart === "Radar Chart"
    ) {
      if (validSelectedHeaderIndices.length >= 2) {
        const labelColIndex = validSelectedHeaderIndices[0];
        labels.push(...dataRows.map((row) => row[labelColIndex]));

        for (let i = 1; i < validSelectedHeaderIndices.length; i++) {
          const dataColIndex = validSelectedHeaderIndices[i];
          datasets.push({
            label: selectedHeaders[i].name,
            data: dataRows
              .map((row) => parseFloat(row[dataColIndex]))
              .filter((val) => !isNaN(val)),
            borderColor: colors[(i - 1) % colors.length],
            backgroundColor:
              selectedChart === "Area Chart"
                ? `rgba(${parseInt(
                    colors[(i - 1) % colors.length].slice(1, 3),
                    16
                  )}, ${parseInt(
                    colors[(i - 1) % colors.length].slice(3, 5),
                    16
                  )}, ${parseInt(
                    colors[(i - 1) % colors.length].slice(5, 7),
                    16
                  )}, 0.5)`
                : undefined,
            fill: selectedChart === "Area Chart",
            tension: 0.4, // Smooth lines
          });
        }
        chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `${selectedChart} of ${selectedHeaders
                .map((h) => h.name)
                .join(", ")}`,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: selectedHeaders[0].name,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Value",
              },
            },
          },
        };
      }
    } else if (selectedChart === "Scatter Plot") {
      if (validSelectedHeaderIndices.length >= 2) {
        const xColIndex = validSelectedHeaderIndices[0];
        const yColIndex = validSelectedHeaderIndices[1];

        datasets.push({
          label: `${selectedHeaders[1].name} vs ${selectedHeaders[0].name}`,
          data: dataRows
            .map((row) => ({
              x: parseFloat(row[xColIndex]),
              y: parseFloat(row[yColIndex]),
            }))
            .filter((point) => !isNaN(point.x) && !isNaN(point.y)),
          backgroundColor: colors[0],
        });
        chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Scatter Plot of ${selectedHeaders[1].name} vs ${selectedHeaders[0].name}`,
            },
          },
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              title: {
                display: true,
                text: selectedHeaders[0].name,
              },
            },
            y: {
              title: {
                display: true,
                text: selectedHeaders[1].name,
              },
            },
          },
        };
      }
    } else if (selectedChart === "Polar Area Chart") {
      // Polar Area needs labels and single dataset
      if (validSelectedHeaderIndices.length >= 2) {
        const labelColIndex = validSelectedHeaderIndices[0];
        const dataColIndex = validSelectedHeaderIndices[1];

        dataRows.forEach((row) => {
          const labelValue = row[labelColIndex];
          const dataValue = parseFloat(row[dataColIndex]);
          if (labelValue !== undefined && !isNaN(dataValue)) {
            labels.push(labelValue);
            datasets.push(dataValue);
          }
        });

        datasets.push({
          data: datasets, // Data values for the segments
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        });
        chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `${selectedChart} of ${selectedHeaders[1].name} by ${selectedHeaders[0].name}`,
            },
          },
          scales: {
            r: {
              beginAtZero: true,
            },
          },
        };
      }
    }

    setDynamicChartData({ labels, datasets, options: chartOptions });
  }, [selectedHeaders, selectedChart, dataRows, headers]); // Added dependencies

  const downloadChartAsPDF = async () => {
    const chartContainer = chartRef.current?.canvas?.parentNode;

    if (!chartContainer) {
      alert("Chart not available.");
      return;
    }

    try {
      const canvas = await html2canvas(chartContainer, {
        backgroundColor: "#fff", // ensures white background in PDF
        scale: 2, // high quality
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${selectedChart.replace(/\s/g, "_")}_chart.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Something went wrong while downloading the chart as PDF.");
    }
  };

  // --- Form Submission Handler ---
  const handleSubmitChartSelection = (e) => {
    e.preventDefault();
    if (selectedHeaders.length > 0 && selectedChart) {
      generateChartData(); // Call the memoized function
      setShowChartWithData(true);
    } else {
      alert("Please select at least one column and a chart type.");
    }
  };

  // Define a mapping of chart names to their components
  const chartTypeComponents = {
    "Pie Chart": Pie,
    "Bar Chart": Bar,
    "Line Chart": Line,
    "Column Chart": Bar, // Column chart is a horizontal bar chart
    "Area Chart": Line, // Area chart is a line chart with fill
    "Scatter Plot": Scatter,
    Histogram: Bar,
    "Doughnut Chart": Doughnut,
    "Radar Chart": Radar,
    "Polar Area Chart": PolarArea,
  };

  // Get the component for the selected chart type
  const SelectedChartComponent = chartTypeComponents[selectedChart];

  // Define static example chart data (moved here for clarity)
  const pieData = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [400, 300, 300],
        backgroundColor: ["#8884d8", "#82ca9d", "#ffc658"],
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      { label: "uv", data: [4000, 3000, 2000], backgroundColor: "#8884d8" },
      { label: "pv", data: [2400, 1398, 9800], backgroundColor: "#82ca9d" },
      {
        label: "Av",
        data: [1200, 1900, 3000],
        backgroundColor: "#ffc658",
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Value",
        data: [100, 300, 200, 500],
        borderColor: "#ff7300",
        fill: false,
      },
      {
        label: "Revenue",
        data: [200, 400, 300, 600],
        borderColor: "#8884d8",
        fill: false,
      },
    ],
  };

  const columnData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 900, 1600, 700],
        backgroundColor: "#8884d8",
      },
    ],
  };

  const areaData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue",
        data: [4000, 3000, 5000, 4780, 5890, 4390, 4490],
        backgroundColor: "rgba(136, 132, 216, 0.5)",
        borderColor: "#8884d8",
        fill: true,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Points",
        data: [
          { x: 10, y: 30 },
          { x: 20, y: 50 },
          { x: 30, y: 40 },
          { x: 40, y: 80 },
          { x: 50, y: 60 },
          { x: 60, y: 90 },
          { x: 70, y: 100 },
        ],
        backgroundColor: "#8884d8",
      },
    ],
  };

  const histogramData = {
    labels: ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60"],
    datasets: [
      {
        label: "Frequency",
        data: [2, 5, 8, 4, 6, 3],
        backgroundColor: "#8884d8",
        borderColor: "#333",
        borderWidth: 2,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };

  // Define a mapping of chart names to their components AND data for static examples
  const chartComponents = {
    "Pie Chart": <Pie data={pieData} />,
    "Bar Chart": <Bar data={barData} />,
    "Line Chart": <Line data={lineData} />,
    "Column Chart": <Bar data={columnData} options={{ indexAxis: "y" }} />,
    "Area Chart": <Line data={areaData} />,
    "Scatter Plot": <Scatter data={scatterData} />,
    Histogram: <Bar data={histogramData} />,
    "Doughnut Chart": <Doughnut data={pieData} />, // Using pieData as example
    "Radar Chart": <Radar data={pieData} />, // Using pieData as example
    "Polar Area Chart": <PolarArea data={pieData} />, // Using pieData as example
  };

  // Function to handle chart click
  const handleChartClick = useCallback((chartName) => {
    setSelectedChart(chartName);
    setShowChartWithData(false); // Reset chart-with-data view on new chart select
  }, []); // Empty dependency array as it only uses state setters

  // Function to show all charts
  const handleShowAllCharts = useCallback(() => {
    setSelectedChart(null);
    setShowChartWithData(false);
    setSelectedHeaders([]);
  }, []); // Empty dependency array as it only uses state setters

  return (
    <div className="p-6 rounded-3xl shadow-2xl border-indigo-200 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-4xl font-extrabold text-indigo-700 drop-shadow-lg tracking-wide flex items-center gap-2">
          <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white px-4 py-2 rounded-full shadow">
            📊
          </span>
          Analytics Dashboard
        </h2>
        <div className="flex gap-4">
          {(selectedChart || showChartWithData) && ( // Show "Show All Charts" if any chart is selected or being displayed
            <button
              onClick={handleShowAllCharts}
              className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 font-semibold"
            >
              Show All Charts
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard/upload")}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 font-semibold"
          >
            ← Back to Upload
          </button>
        </div>
      </div>

      {/* Conditionally render all charts or the selected chart and form */}
      {!selectedChart ? (
        // --- Display All Example Charts ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          <ChartBlock
            title="Pie Chart"
            color="from-pink-200 to-pink-400"
            chartName="Pie Chart"
            onClick={handleChartClick}
          >
            <Pie data={pieData} />
          </ChartBlock>
          <ChartBlock
            title="Bar Chart"
            color="from-indigo-200 to-indigo-400"
            chartName="Bar Chart"
            onClick={handleChartClick}
          >
            <Bar data={barData} />
          </ChartBlock>
          <ChartBlock
            title="Line Chart"
            color="from-purple-200 to-purple-400"
            chartName="Line Chart"
            onClick={handleChartClick}
          >
            <Line data={lineData} />
          </ChartBlock>
          <ChartBlock
            title="Column Chart"
            color="from-blue-200 to-blue-400"
            chartName="Column Chart"
            onClick={handleChartClick}
          >
            <Bar data={columnData} options={{ indexAxis: "y" }} />
          </ChartBlock>
          <ChartBlock
            title="Area Chart"
            color="from-green-200 to-green-400"
            chartName="Area Chart"
            onClick={handleChartClick}
          >
            <Line data={areaData} />
          </ChartBlock>
          <ChartBlock
            title="Scatter Plot"
            color="from-yellow-200 to-yellow-400"
            chartName="Scatter Plot"
            onClick={handleChartClick}
          >
            <Scatter data={scatterData} />
          </ChartBlock>
          <ChartBlock
            title="Histogram"
            color="from-gray-200 to-gray-400"
            chartName="Histogram"
            onClick={handleChartClick}
          >
            <Bar data={histogramData} />
          </ChartBlock>
          <ChartBlock
            title="Doughnut Chart"
            color="from-red-200 to-red-400"
            chartName="Doughnut Chart"
            onClick={handleChartClick}
          >
            <Doughnut data={pieData} />
          </ChartBlock>
          <ChartBlock
            title="Radar Chart"
            color="from-orange-200 to-orange-400"
            chartName="Radar Chart"
            onClick={handleChartClick}
          >
            <Radar data={pieData} />
          </ChartBlock>
          <ChartBlock
            title="Polar Area Chart"
            color="from-teal-200 to-teal-400"
            chartName="Polar Area Chart"
            onClick={handleChartClick}
          >
            <PolarArea data={pieData} />
          </ChartBlock>
        </div>
      ) : (
        // --- Display Selected Chart and Input Form ---
        <div className="flex flex-col md:flex-row justify-center items-start gap-6 p-4">
          <div className="w-full md:w-2/6 flex justify-center">
            {showChartWithData && dynamicChartData ? (
              // Show dynamically generated chart with download button
              <div className="flex flex-col items-center w-full">
                <ChartBlock
                  title={`${selectedChart} (Your Data)`}
                  color="from-blue-100 to-blue-300"
                  size={500}
                >
                  {SelectedChartComponent && (
                    <SelectedChartComponent
                      ref={chartRef}
                      data={dynamicChartData}
                      options={dynamicChartData.options}
                    />
                  )}
                </ChartBlock>
                <div className="w-full text-center ">
                  <button
                    className="mt-4  w-full md:w-5/12 mr-0 md:mr-2  bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform font-semibold"
                    onClick={() => {
                      if (chartRef.current) {
                        const chart = chartRef.current;
                        const originalWidth = chart.width;
                        const originalHeight = chart.height;
                        const originalDPR =
                          chart.options.devicePixelRatio ||
                          window.devicePixelRatio ||
                          1;
                        // Set to large dimensions and high devicePixelRatio for best quality
                        chart.options.devicePixelRatio = 3;
                        chart.resize(2000, 1600);
                        chart.update("none");
                        let url;
                        if (chart && chart.toBase64Image) {
                          url = chart.toBase64Image("image/png", 1);
                        } else if (
                          chart &&
                          chart.canvas &&
                          chart.canvas.toDataURL
                        ) {
                          url = chart.canvas.toDataURL("image/png", 1);
                        }
                        // Restore original size and devicePixelRatio
                        chart.options.devicePixelRatio = originalDPR;
                        chart.resize(originalWidth, originalHeight);
                        chart.update("none");
                        if (url) {
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `${selectedChart.replace(
                            /\s/g,
                            "_"
                          )}_chart.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          alert(
                            "Unable to download chart. Try a different browser or update react-chartjs-2."
                          );
                        }
                      }
                    }}
                  >
                    Download as PNG
                  </button>
                  <button
                    className="mt-2 w-full md:w-5/12    bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform font-semibold"
                    onClick={downloadChartAsPDF}
                  >
                    Download as PDF
                  </button>
                </div>
              </div>
            ) : (
              // Show static example of selected chart
              <ChartBlock
                title={selectedChart}
                color="from-white to-gray-100"
                size={400} // Default size for static example
              >
                {/* FIX: Directly render the pre-defined example chart from chartComponents */}
                {chartComponents[selectedChart]}
              </ChartBlock>
            )}
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100 w-full max-w-md flex flex-col gap-4">
              <h3 className="text-xl font-bold mb-2 text-indigo-700 text-center">
                Configure Your Chart
              </h3>
              <form
                onSubmit={handleSubmitChartSelection}
                className="flex flex-col gap-4"
              >
                <label
                  htmlFor="multiSelectHeaders"
                  className="font-semibold text-gray-700"
                >
                  Select columns to display:
                </label>
                <MultiSelect
                  id="multiSelectHeaders"
                  value={selectedHeaders}
                  onChange={(e) => setSelectedHeaders(e.value)}
                  options={headerOptions}
                  optionLabel="name"
                  display="chip"
                  placeholder="Select Columns"
                  maxSelectedLabels={5}
                  className="w-full" // Use w-full for responsiveness
                  disabled={headerOptions.length === 0}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform font-semibold"
                >
                  Generate Chart
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Chart Block wrapper
const ChartBlock = ({
  title,
  children,
  color,
  size, // size is now a max-width/height hint, not fixed dimensions
  chartName,
  onClick,
}) => (
  <div
    className={`bg-gradient-to-br ${
      typeof color === "string" ? color : "from-white to-gray-100"
    } rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-200 ${
      onClick ? "cursor-pointer" : ""
    }
    w-full aspect-square max-w-[${size}px] max-h-[${size}px]`} /* Apply responsive sizing here */
    // Removed fixed width/height from style, using Tailwind classes instead
    onClick={() => onClick && onClick(chartName)} // Call onClick if provided
  >
    <h3 className="text-xl font-extrabold mb-3 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
      {title}
    </h3>
    <div
      style={{
        width: "100%", // Inner div takes full width/height of parent ChartBlock
        height: "100%",
        margin: "auto",
        background: "rgba(255,255,255,0.7)",
        borderRadius: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex", // Ensure chart centers within this div
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  </div>
);