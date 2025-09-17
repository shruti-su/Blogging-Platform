import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";

import AdminService from "@/services/api/admin-file-permission"; // Make sure this service has updateUser
import { sweetAlert } from "../../components/SweetAlert/SweetAlert";

function UserManagement() {
  const [fileRecords, setFileRecords] = useState([]);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);

  const { showSuccess, showError, showWarning, showConfirm } = sweetAlert();
  const navigate = useNavigate();

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

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

  const filteredRecords = useMemo(() => {
    if (!globalFilter) {
      return fileRecords;
    }
    return fileRecords.filter((record) => {
      return Object.values(record).some((value) =>
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      );
    });
  }, [fileRecords, globalFilter]);

  const sortedRecords = useMemo(() => {
    let sortableItems = [...filteredRecords];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredRecords, sortConfig]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedRecords, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedRecords.length / rowsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUpIcon className="inline w-4 h-4 ml-1" />
    ) : (
      <ArrowDownIcon className="inline w-4 h-4 ml-1" />
    );
  };

  const handleMenuToggle = (event, userId) => {
    event.stopPropagation();
    if (openMenu === userId) {
      setOpenMenu(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 144, // 144px is w-36
      });
      setOpenMenu(userId);
    }
  };

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

  const editButtonTemplate = (rowData) => (
    <button
      onClick={(e) => handleMenuToggle(e, rowData.id)}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
  );

  return (
    <div className="p-6 mt-9">
      <div className="font-bold text-center flex flex-col items-center justify-center w-full">
        <h2 className="text-5xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          User Records and Permissions
        </h2>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-6 flex justify-center">
        <span className="relative w-full md:w-1/2">
          <i className="pi pi-search absolute top-2/4 -mt-2 left-4 text-gray-400 dark:text-gray-500" />
          <InputText
            placeholder="Search users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-base rounded-xl border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </span>
      </div>

      {/* 🖥️ Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <tr>
              {["User Name", "Email", "Role", "Actions"].map((header, idx) => (
                <th
                  key={idx}
                  onClick={
                    header !== "Actions"
                      ? () => requestSort(header.toLowerCase().replace(" ", ""))
                      : undefined
                  }
                  className="px-6 py-4 text-sm font-bold tracking-wider text-white uppercase text-center cursor-pointer"
                >
                  {header}{" "}
                  {header !== "Actions" && getSortIcon(header.toLowerCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedRecords.map((user, i) => (
              <tr
                key={user.id}
                className={`text-base ${
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-purple-50 dark:hover:bg-gray-600 transition`}
              >
                <td className="px-6 py-4 text-center font-medium text-gray-800 dark:text-gray-200">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-center capitalize text-gray-700 dark:text-gray-300">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {editButtonTemplate(user)}
                </td>
              </tr>
            ))}
            {paginatedRecords.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 text-lg"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="space-y-5 md:hidden">
        {paginatedRecords.map((user) => (
          <div
            key={user.id}
            className="p-5 bg-white rounded-xl shadow-md dark:bg-gray-800 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
                <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900/40 dark:text-purple-300 capitalize">
                  {user.role}
                </span>
              </div>
              <div className="flex gap-2">{editButtonTemplate(user)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Portal */}
      {openMenu &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 w-36 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <button
              onClick={() => {
                const userToEdit = fileRecords.find((u) => u.id === openMenu);
                if (userToEdit) {
                  handleEdit(userToEdit);
                }
                setOpenMenu(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
            >
              <PencilIcon className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={() => {
                handleDelete(openMenu);
                setOpenMenu(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <TrashIcon className="h-4 w-4" /> Delete
            </button>
          </div>,
          document.body
        )}

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Rows per page:
          </span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
            className="p-1 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
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
          <div className="flex flex-col gap-6 px-5 py-4 bg-gray-50 rounded-b-xl">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
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
              <button
                onClick={() => setEditDialogVisible(false)}
                className="px-5 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 ease-in-out flex items-center gap-2"
              >
                <XMarkIcon className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-in-out flex items-center gap-2"
              >
                <CheckIcon className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default UserManagement;
