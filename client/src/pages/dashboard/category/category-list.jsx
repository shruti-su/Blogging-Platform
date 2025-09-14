import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

// API service
import CategoryService from "@/services/api/category";
import { sweetAlert } from "../../../components/SweetAlert/SweetAlert";

// Heroicons
import {
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [visible, setVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const { showSuccess, showError, showConfirm } = sweetAlert();

  // ✅ Load categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        // The API returns an object { categories: [...] }, so we need to access the array.
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
        showError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleMenuToggle = (event, categoryId) => {
    if (openMenu === categoryId) {
      setOpenMenu(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4, // Position below the button
        left: rect.right - 144, // Align right edge (w-36 = 144px)
      });
      setOpenMenu(categoryId);
    }
  };

  // ✅ Open Add Dialog
  const handleOpenAdd = () => {
    setEditId(null);
    setNewCategory("");
    setVisible(true);
  };

  // ✅ Open Edit Dialog
  const handleEdit = (id) => {
    const category = categories.find((c) => c._id === id);
    if (category) {
      setEditId(id); // The ID from the category object which is `_id`
      setNewCategory(category.name);
      setVisible(true);
    }
  };

  // ✅ Save category (Add via API, Edit locally)
  const handleSave = async () => {
    if (newCategory.trim() === "") return;

    try {
      if (editId) {
        // Update existing category via API
        const updatedCat = await CategoryService.updateCategory(editId, {
          name: newCategory.trim(),
        });
        setCategories(
          categories.map((cat) =>
            cat._id === editId ? updatedCat.category : cat
          )
        );
        showSuccess("Category updated successfully!");
      } else {
        // Add new category via API
        const newCat = { name: newCategory.trim() };
        const savedCategory = await CategoryService.addCategory(newCat);
        setCategories([...categories, savedCategory.category]);
        showSuccess("Category added successfully!");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      showError(error.response?.data?.msg || "Failed to save category.");
    }

    setNewCategory("");
    setEditId(null);
    setVisible(false);
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    try {
      await CategoryService.deleteCategory(id);
      setCategories(categories.filter((cat) => cat._id !== id));
      showSuccess("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      showError(error.response?.data?.msg || "Failed to delete category.");
    }
  };

  return (
    <div className="w-full mt-9 p-6 bg-white shadow-md dark:bg-gray-800 rounded-xl ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📂 Category List
        </h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
        >
          <PlusIcon className="w-5 h-5" /> Add
        </button>
      </div>

      {/* Table */}
      <div className="relative overflow-visible overflow-x-auto">
        <table className="w-full overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
          <thead className="bg-purple-500">
            <tr>
              <th className="px-6 py-3 text-base font-bold tracking-wider text-left text-white uppercase">
                Category Name
              </th>
              <th className="px-6 py-3 text-base font-bold tracking-wider text-right text-white uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="overflow-visible divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat, i) => (
              <tr
                key={cat._id}
                className={`${
                  i % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-700/50"
                    : "bg-white dark:bg-gray-800"
                } hover:bg-gray-100 dark:hover:bg-gray-600 border-t border-gray-200 dark:border-gray-700`}
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {cat.name}
                </td>
                <td className="relative px-6 py-4 text-right">
                  {/* Three dot button */}
                  <button
                    onClick={(e) => handleMenuToggle(e, cat._id)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No categories available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dropdown Menu Portal */}
      {openMenu &&
        menuPosition &&
        createPortal(
          <div
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-36 dark:bg-gray-800 dark:border-gray-700"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <button
              onClick={() => {
                handleEdit(openMenu);
                setOpenMenu(null);
              }}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
            >
              <PencilIcon className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => {
                handleDelete(openMenu);
                setOpenMenu(null);
              }}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </div>,
          document.body
        )}

      {/* Add/Edit Dialog */}
      <Dialog
        header={
          <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                fill="currentColor"
              />
            </svg>
            {editId ? "Edit Category" : "Add New Category"}
          </div>
        }
        visible={visible}
        style={{ width: "28rem" }}
        modal
        onHide={() => {
          setVisible(false);
          setEditId(null);
          setNewCategory("");
        }}
        className="bg-white rounded-lg shadow-lg dark:bg-gray-900"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setVisible(false)}
            />
            <Button
              label={editId ? "Update" : "Add"}
              className="px-4 py-2 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
              onClick={handleSave}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <label
            htmlFor="categoryName"
            className="font-medium text-gray-700 dark:text-gray-200"
          >
            Category Name
          </label>
          <InputText
            id="categoryName"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name..."
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 "
          />
        </div>
      </Dialog>
    </div>
  );
}

export default CategoryList;
