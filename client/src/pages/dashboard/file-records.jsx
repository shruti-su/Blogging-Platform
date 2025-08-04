import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import fileuploadService from "/src/services/api/fileupload.js";
import { sweetAlert } from "../../components/SweetAlert/SweetAlert";

function FileRecords() {
  const [fileRecords, setFileRecords] = useState([]);
  const { showSuccess, showError, showWarning, showConfirm } = sweetAlert();

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileRecords = async () => {
      try {
        const records = await fileuploadService.getFileRecords();
        console.log("Fetched file records:", records);
        // FIX: Corrected syntax for map function's implicit return of an object
        const formattedRecords = Array.isArray(records)
          ? records.map((record) => ({
              // Removed 'return' keyword and ensured object literal is wrapped in parentheses
              ...record,
              id: record._id, // Map Mongoose's _id to 'id' for PrimeReact's dataKey
              uploadedAt: record.uploadedAt
                ? new Date(record.uploadedAt).toLocaleString()
                : "N/A", // Ensure uploadedAt is formatted
            }))
          : [];
        setFileRecords(formattedRecords); // Set the formatted records
      } catch (error) {
        console.error("Failed to fetch file records:", error);
        showError("Failed to load file records.");
      }
    };

    fetchFileRecords();
  }, []);

  // Handle delete action
  const handleDelete = async (recordId) => {
    const confirmed = await showConfirm(
      "Are you sure you want to delete this file record?"
    );
    if (!confirmed) return;

    try {
      await fileuploadService.deleteFileRecord(recordId); // Assuming you have this API
      setFileRecords((prev) => prev.filter((rec) => rec.id !== recordId));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  const handleAnalyse = async (recordData) => {
    const confirmed = await showConfirm("Do you want to analyse this file?");
    if (!confirmed) return;
    navigate("/dashboard/charts", { state: { parsedData: recordData } });
  };

  // Delete button template for each row
  const deleteButtonTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-external-link"
          label="Analyse"
          className="p-button-danger p-button-sm mr-4"
          onClick={() => handleAnalyse(rowData.data)} // Use correct ID/key
          tooltip="Analyse"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          label="Delete"
          severity="danger"
          onClick={() => handleDelete(rowData.id)} // Use correct ID/key
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  return (
    <>
      <div className="font-bold text-center flex flex-col items-center justify-center w-full mt-14">
        <h1 className="text-5xl text-center font-extrabold font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-700 to-purple-400 drop-shadow-lg mb-4 animate-fade-in-slow">
          Previous File Records
        </h1>
      </div>

      <div className="card">
        <DataTable
          value={fileRecords}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "100%" }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          selectionMode="single" // Optional: if you want row selection
          dataKey="id" // Crucial: tell DataTable to use the 'id' field for unique row identification
          emptyMessage="No file records found." // Message when table is empty
        >
          <Column
            field="fileName"
            header="File Name"
            style={{ width: "30%" }}
          />
          <Column
            field="uploadedAt"
            header="Uploaded At"
            style={{ width: "30%" }}
          />
          <Column
            body={deleteButtonTemplate}
            header="Actions"
            style={{ width: "20%", textAlign: "center" }}
          />
        </DataTable>
      </div>
    </>
  );
}

export default FileRecords;