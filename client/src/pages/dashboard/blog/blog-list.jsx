// src/pages/dashboard/blog/blog-list.jsx
import { useEffect, useState } from "react";
import BlogService from "@/services/api/blog";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await BlogService.getAllBlogs();
        // Ensure we always get an array
        setBlogs(Array.isArray(res.blogs) ? res.blogs : []);
      } catch (err) {
        console.error("❌ Error fetching blogs:", err);
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Blogs
      </h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Date
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  {/* Blog Image */}
                  <td className="px-6 py-4">
                    {blog.attachedImages?.length > 0 ? (
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
                  </td>

                  {/* Blog Title */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {blog.blogTitle}
                  </td>

                  {/* Blog Category */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {blog.blogType}
                  </td>

                  {/* Blog Date */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}{" "}
                    {new Date(blog.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right text-sm">
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </MenuButton>

                      <MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800">
                        <div className="py-1">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                                } w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200`}
                              >
                                ✏️ Edit
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                                } w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400`}
                              >
                                🗑 Delete
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
