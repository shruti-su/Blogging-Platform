import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { sweetAlert } from "../../components/SweetAlert/SweetAlert";
import fileuploadService from "/src/services/api/fileupload.js";
import { useTheme } from "@/components/context/ThemeContext"; // 👈 import theme

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { showSuccess, showError, showWarning } = sweetAlert();
  const navigate = useNavigate();
  const { isDark } = useTheme(); // 👈 access dark mode

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      setSelectedFile(file);
      showSuccess("File selected successfully!");

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setParsedData(json);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setSelectedFile(null);
      setParsedData([]);
      showError("Invalid file type. Please upload an Excel or CSV file.");
    }
  };

  const handleFileInputChange = (event) => {
    handleFileChange(event.target.files[0]);
    event.target.value = null;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showWarning("Please select a file first.");
      return;
    }
    try {
      const response = await fileuploadService.uploadFile(selectedFile);
      if (response && response.message) {
        showSuccess(response.message);
        setSelectedFile(null);
      } else {
        showError("Upload failed. Please try again.");
        setSelectedFile(null);
      }
    } catch (err) {
      showError("Error uploading file.");
    }
  };

  return (
    <div className="text-3xl font-bold text-center flex flex-col items-center justify-center w-full mt-32">
      <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-4">
        Upload Excel File
      </h1>
      {/* Upload Section */}
      {!selectedFile && (
        <Card
          className={`w-full max-w-[48rem] mx-auto mt-8 border-4 border-dotted transition-colors duration-300
          shadow-xl rounded-xl flex items-center justify-center text-center
          ${isDark
              ? `bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-blue-600`
              : `bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-blue-400`
            }
          ${isDragOver ? "border-blue-600" : ""}
        `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardBody className="flex flex-col items-center justify-center h-64 p-8 gap-4 w-full">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              id="file-upload"
              onChange={handleFileInputChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-10 text-blue-500 drop-shadow-lg mb-2 animate-bounce"
            >
              <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
            </svg>
            <Button
              className="justify-center mx-auto px-8 py-3 text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md rounded-full transition-all duration-300"
              color="blue"
              onClick={() => document.getElementById("file-upload").click()}
            >
              Upload
            </Button>

            <Typography
              className={`mt-4 text-lg font-semibold ${isDark ? "text-blue-200" : "text-blue-700"
                }`}
            >
              Drag and drop your file here or
            </Typography>
            <Typography
              className={`text-sm italic ${isDark ? "text-gray-300" : "text-gray-500"
                }`}
            >
              Supported formats: .xlsx, .xls, .csv
            </Typography>
          </CardBody>
        </Card>
      )}

      {/* File Preview Section */}
      {selectedFile && (
        <div
          className={`w-full max-w-[48rem] mx-auto mt-6 p-6 rounded-xl shadow-lg flex flex-col items-center border ${isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-blue-200"
            }`}
        >
          <Typography
            className={`text-md font-medium mb-4 text-center ${isDark ? "text-blue-300" : "text-blue-600"}`}
          >
            📄 <span className="font-semibold">Selected File:</span> {selectedFile.name}
          </Typography>

          {parsedData.length > 0 && (
            <div className="overflow-auto w-full mb-4">
              <table className={`min-w-full border rounded-md overflow-hidden ${isDark ? "border-gray-700" : "border-blue-200"}`}>
                <thead>
                  <tr>
                    {parsedData[0].map((header, idx) => (
                      <th
                        key={idx}
                        className={`border px-2 py-1 font-bold ${isDark
                          ? "bg-gray-700 text-blue-300 border-gray-600"
                          : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(1).map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={`${isDark
                        ? `${rowIdx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600`
                        : `${rowIdx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`
                        }`}
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`border px-2 py-1 ${isDark
                            ? "text-gray-200 border-gray-600"
                            : "text-gray-700 border-gray-300"
                            }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

          {/* Buttons Section */}
          <div className="flex gap-4 mt-2">
            <Button
              color="red"
              className="px-5 py-2 font-semibold shadow-sm rounded-xl"
              onClick={() => {
                setSelectedFile(null);
                setParsedData([]);
              }}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              className="px-5 py-2 font-semibold shadow-sm rounded-xl"
              onClick={() => {
                showSuccess("Data analyzed successfully!");
                navigate("/dashboard/charts", { state: { parsedData } });
              }}
            >
              Analyze
            </Button>
            <Button
              color="green"
              className="px-5 py-2 font-semibold shadow-sm rounded-xl"
              onClick={async () => {
                await handleUpload();
                setParsedData([]);
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
