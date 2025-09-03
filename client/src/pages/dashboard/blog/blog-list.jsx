// src/pages/dashboard/blog/blog-list.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import BlogService from "@/services/api/blog";
import { sweetAlert } from "../../../components/SweetAlert/SweetAlert";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [openMenu, setOpenMenu] = useState(null); // blog ID of open menu
  const [menuPosition, setMenuPosition] = useState(null); // position for dropdown
  const { showSuccess, showError, showConfirm } = sweetAlert();
  const navigate = useNavigate();

  // ✅ Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch only the blogs for the currently logged-in user
        const res = await BlogService.getUserBlogs();
        setBlogs(Array.isArray(res.blogs) ? res.blogs : []);
      } catch (err) {
        console.error("❌ Error fetching user blogs:", err);
        showError("Failed to load your blogs. Please try again.");
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  // ✅ Toggle menu on click
  const handleMenuToggle = (event, blogId) => {
    if (openMenu === blogId) {
      setOpenMenu(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 144, // w-36 = 144px, align right
      });
      setOpenMenu(blogId);
    }
  };

  // ✅ Edit blog
  const handleEdit = (id) => {
    // Navigate to the new dynamic edit route
    navigate(`/dashboard/edit-blog/${id}`);
  };

  // ✅ Delete blog
  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm(
      "Are you sure you want to delete this blog? "
    );
    if (isConfirmed) {
      try {
        await BlogService.deleteBlog(id);
        // Remove the deleted blog from the state to update the UI
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        showSuccess("Blog deleted successfully!");
      } catch (err) {
        console.error("❌ Error deleting blog:", err);
        showError("Failed to delete the blog. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 mt-9 bg-white rounded-xl shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        My Blogs
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead className="bg-purple-600">
            <tr>
              <th className="px-6 py-3 text-xs font-bold tracking-wider text-white uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-xs font-bold tracking-wider text-white uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-bold tracking-wider text-white uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-bold tracking-wider text-right text-white uppercase">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {blogs.map((blog, i) => (
              <tr
                key={blog._id}
                className={`${
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                }`}
              >
                {/* Title + Image */}
                <td className="px-6 py-4 flex items-center gap-3">
                  {blog.attachedImages?.length > 0 &&
                  blog.attachedImages[0].data ? (
                    <img
                      src={`data:${blog.attachedImages[0].contentType};base64,${blog.attachedImages[0].data}`}
                      alt={blog.blogTitle}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      📷
                    </div>
                  )}
                  <Link to={`/dashboard/blog-viewer/${blog._id}`}>
                    <span className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                      {blog.blogTitle}
                    </span>
                  </Link>
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {blog.blogType}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(blog.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => handleMenuToggle(e, blog._id)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="relative p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow"
          >
            <div className="flex items-start gap-4">
              {/* Image */}
              {blog.attachedImages?.length > 0 &&
              blog.attachedImages[0].data ? (
                <img
                  src={`data:${blog.attachedImages[0].contentType};base64,${blog.attachedImages[0].data}`}
                  alt={blog.blogTitle}
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 flex-shrink-0">
                  📷
                </div>
              )}
              {/* Content */}
              <div className="flex-grow">
                <Link to={`/dashboard/blog-viewer/${blog._id}`}>
                  <h3 className="text-md font-semibold text-blue-600 hover:underline dark:text-blue-400 pr-8">
                    {blog.blogTitle}
                  </h3>
                </Link>
                <span className="text-xs px-2 py-1 mt-1 inline-block rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  {blog.blogType}
                </span>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            {/* Actions Button */}
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => handleMenuToggle(e, blog._id)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Blogs Message */}
      {blogs.length === 0 && (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          <p>You haven't written any blogs yet.</p>
          <Link
            to="/dashboard/upload-blog"
            className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
          >
            Create Your First Blog
          </Link>
        </div>
      )}

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
    </div>
  );
}
