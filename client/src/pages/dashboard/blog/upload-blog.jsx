import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sweetAlert } from "../../../components/SweetAlert/SweetAlert";
import CategoryService from "@/services/api/category";

function UploadBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const { showError } = sweetAlert();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        if (data && data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      showError("Please enter a blog title.");
      return;
    }
    if (!category) {
      showError("Please select a category.");
      return;
    }
    // pass title & category to editor (state or params)
    navigate("/dashboard/edit-blog", { state: { title, category } });
  };
  return (
    <div className="flex justify-center px-4 py-36 dark:bg-slate-900">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl sm:p-8 lg:p-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-gray-100">
            ✍️ Create Your Blog
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Share your thoughts, stories, and experiences with the world 🌍
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200 sm:text-base">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 sm:px-4 sm:py-3 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-base"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200 sm:text-base">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 sm:px-4 sm:py-3 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-base"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 text-sm font-semibold text-white transition duration-300 bg-purple-600 rounded-lg shadow-md sm:py-3 hover:bg-purple-700 hover:shadow-lg sm:text-base"
          >
            ✍️ Start Writing
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadBlog;
