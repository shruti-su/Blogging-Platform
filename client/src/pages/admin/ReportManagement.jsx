import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Menu } from "primereact/menu";
import ReportService from "@/services/api/report";
import { sweetAlert } from "@/components/SweetAlert/SweetAlert";
import {
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showConfirm } = sweetAlert();
  const menu = useRef(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await ReportService.getReports();
      setReports(data);
    } catch (err) {
      showError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSeen = async (reportId) => {
    try {
      await ReportService.markReportAsSeen(reportId);
      showSuccess("Report marked as seen.");
      fetchReports(); // Refresh the list
    } catch (err) {
      showError("Failed to mark report as seen.");
    }
  };

  const handleDeleteReport = async (reportId) => {
    const isConfirmed = await showConfirm(
      "Are you sure you want to delete this report?"
    );
    if (isConfirmed) {
      try {
        await ReportService.deleteReport(reportId);
        showSuccess("Report deleted successfully.");
        fetchReports(); // Refresh the list
      } catch (err) {
        showError("Failed to delete report.");
      }
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.seen ? "Seen" : "New"}
        severity={rowData.seen ? "success" : "warning"}
      />
    );
  };

  const blogTitleBodyTemplate = (rowData) => {
    if (!rowData.blog) {
      return <span className="text-gray-500 italic">Blog deleted</span>;
    }
    return (
      <Link
        to={`/admin/blog-viewer/${rowData.blog._id}`}
        className="text-indigo-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {rowData.blog.blogTitle}
      </Link>
    );
  };

  const authorBodyTemplate = (rowData) => {
    if (!rowData.blog?.author) {
      return <span className="text-gray-500 italic">N/A</span>;
    }
    return (
      <Link
        to={`/admin/user/${rowData.blog.author._id}`}
        className="text-indigo-600 hover:underline"
      >
        {rowData.blog.author.name}
      </Link>
    );
  };

  const reporterBodyTemplate = (rowData) => {
    if (!rowData.reporter) {
      return <span className="text-gray-500 italic">N/A</span>;
    }
    return (
      <Link
        to={`/admin/user/${rowData.reporter._id}`}
        className="text-indigo-600 hover:underline"
      >
        {rowData.reporter.name}
      </Link>
    );
  };

  const createdAtBodyTemplate = (rowData) => {
    return new Date(rowData.createdAt).toLocaleString();
  };

  const actionBodyTemplate = (rowData) => {
    const items = [
      {
        label: "View Blog",
        icon: <EyeIcon className="w-4 h-4 mr-2" />,
        command: () => {
          if (rowData.blog?._id) {
            window.open(`/admin/blog-viewer/${rowData.blog._id}`, "_blank");
          }
        },
        disabled: !rowData.blog,
      },
      {
        label: "Mark as Seen",
        icon: <CheckCircleIcon className="w-4 h-4 mr-2" />,
        command: () => handleMarkAsSeen(rowData._id),
        disabled: rowData.seen,
      },
      {
        label: "Delete Report",
        icon: <TrashIcon className="w-4 h-4 mr-2 text-red-500" />,
        command: () => handleDeleteReport(rowData._id),
        className: "text-red-500",
      },
    ];

    return (
      <>
        <Menu model={items} popup ref={menu} id={`menu_${rowData._id}`} />
        <Button
          icon={<EllipsisVerticalIcon className="w-5 h-5" />}
          text
          rounded
          onClick={(event) => menu.current.toggle(event)}
          aria-controls={`menu_${rowData._id}`}
          aria-haspopup
        />
      </>
    );
  };

  return (
    <div className="p-6 mt-9">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Report Management
        </h2>
        <DataTable
          value={reports}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          loading={loading}
          dataKey="_id"
          emptyMessage="No reports found."
          className="p-datatable-customers"
          sortField="createdAt"
          sortOrder={-1}
        >
          <Column
            field="blog.blogTitle"
            header="Blog Title"
            body={blogTitleBodyTemplate}
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="reason"
            header="Reason"
            sortable
            style={{ minWidth: "16rem" }}
          />
          <Column
            field="blog.author.name"
            header="Blog Author"
            body={authorBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="reporter.name"
            header="Reporter"
            body={reporterBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="createdAt"
            header="Reported On"
            body={createdAtBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="seen"
            header="Status"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "8rem", textAlign: "center" }}
            exportable={false}
          />
        </DataTable>
      </div>
    </div>
  );
}
