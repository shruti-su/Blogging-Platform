import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

// Heroicons
import {
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function CategoryList() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Technology" },
    { id: 2, name: "Travel" },
  ]);

  const [openMenu, setOpenMenu] = useState(null);
  const [visible, setVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Add new category
  const handleAdd = () => {
    if (newCategory.trim() !== "") {
      setCategories([
        ...categories,
        { id: Date.now(), name: newCategory.trim() },
      ]);
      setNewCategory(""); // clear input
      setVisible(false); // close dialog
    }
  };

  // Delete category
  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="w-full px-4 py-4 bg-white shadow-md dark:bg-gray-800 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📂 Category List
        </h2>
        <button
          onClick={() => setVisible(true)}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
        >
          <PlusIcon className="w-5 h-5" /> Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-left text-gray-700 dark:text-gray-200">
                Category Name
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-right text-gray-700 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {cat.name}
                </td>
                <td className="relative px-6 py-4 text-right">
                  {/* Three dot button */}
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === cat.id ? null : cat.id)
                    }
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenu === cat.id && (
                    <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg right-10 top-10 w-36 dark:bg-gray-800 dark:border-gray-700">
                      <button
                        onClick={() => {
                          handleEdit(cat.id);
                          setOpenMenu(null);
                        }}
                        className="flex items-center w-full gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
                      >
                        <PencilIcon className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(cat.id);
                          setOpenMenu(null);
                        }}
                        className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      >
                        <TrashIcon className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
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

      {/* Add Category Dialog */}
      <Dialog
        header="➕ Add New Category"
        visible={visible}
        style={{ width: "25rem" }}
        modal
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setVisible(false)}
            />
            <Button label="Add" severity="success" onClick={handleAdd} />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="categoryName" className="font-medium">
            Category Name
          </label>
          <InputText
            id="categoryName"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name..."
            className="w-full"
          />
        </div>
      </Dialog>
    </div>
  );
}

export default CategoryList;
