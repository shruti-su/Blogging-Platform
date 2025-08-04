import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import AdminService from "@/services/api/admin-file-permission"; // Make sure this service has updateUser
import { sweetAlert } from "../../components/SweetAlert/SweetAlert";

function UserManagement() {
  const [fileRecords, setFileRecords] = useState([]);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { showSuccess, showError, showWarning, showConfirm } = sweetAlert();
  const navigate = useNavigate();

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  useEffect(() => {
    const fetchFileRecords = async () => {
      try {
        const records = await AdminService.getAllUsers();
        const formattedRecords = Array.isArray(records)
          ? records.map((record) => ({
            ...record,
            id: record._id,
          }))
          : [];
        setFileRecords(formattedRecords);
      } catch (error) {
        console.error("Failed to fetch file records:", error);
        showError("Failed to load file records.");
      }
    };

    fetchFileRecords();
  }, []);

  const handleDelete = async (recordId) => {
    const confirmed = await showConfirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      await AdminService.deleteUser(recordId);
      setFileRecords((prev) => prev.filter((rec) => rec.id !== recordId));
      showSuccess("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      showError("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setEditDialogVisible(true);
  };

  const handleEditChange = (field, value) => {
    setEditingUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    try {
      await AdminService.updateUser(editingUser.id, editingUser);
      const updatedRecords = fileRecords.map((u) =>
        u.id === editingUser.id ? editingUser : u
      );
      setFileRecords(updatedRecords);
      setEditDialogVisible(false);
      showSuccess("User updated successfully.");
    } catch (error) {
      console.error("Error updating user:", error);
      showError("Failed to update user.");
    }
  };

  const editButtonTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          label="Edit"
          className="mr-2"
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          label="Delete"
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
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
          User Records and Permissions
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
          selectionMode="single"
          dataKey="id"
          emptyMessage="No file records found."
        >
          <Column field="name" header="User Name" />
          <Column field="email" header="Email" />
          <Column field="role" header="Role" />
          <Column body={editButtonTemplate} header="Actions" />
        </DataTable>
      </div>

      {/* Edit Dialog */}
      <Dialog
        header={
          <div className="text-xl font-semibold text-white bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 px-5 py-3 rounded-t-lg shadow">
            Edit User
          </div>
        }
        visible={editDialogVisible}
        onHide={() => setEditDialogVisible(false)}
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{ width: "30rem", borderRadius: "1rem" }}
        modal
      >
        {editingUser && (
          <div className="flex flex-col gap-6 px-5 py-4 bg-white rounded-b-xl">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <InputText
                id="name"
                value={editingUser.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="w-full mt-1 p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <InputText
                id="email"
                value={editingUser.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                className="w-full mt-1 p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <Dropdown
                id="role"
                value={editingUser.role}
                options={roleOptions}
                onChange={(e) => handleEditChange("role", e.value)}
                className="w-full mt-1"
                placeholder="Select Role"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              {/* Cancel Button */}
              <button
                onClick={() => setEditDialogVisible(false)}
                className="px-5 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 ease-in-out flex items-center gap-2"
              >
                <i className="pi pi-times" />
                Cancel
              </button>

              {/* Save Button */}
              <button
                onClick={handleEditSave}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-in-out flex items-center gap-2"
              >
                <i className="pi pi-check" />
                Save
              </button>
            </div>
          </div>
        )}
      </Dialog>

    </>
  );
}

export default UserManagement;
