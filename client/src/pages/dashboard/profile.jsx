import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  UsersIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

import { useAuth } from "@/components/auth/AuthContext";
import { Avatar } from "primereact/avatar";

import BlogService from "@/services/api/blog";
import followService from "@/services/api/followService";
import { sweetAlert } from "@/components/SweetAlert/SweetAlert";

export function ProfilePage() {
  const { user: currentUser } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const { showSuccess, showError, showConfirm } = sweetAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch blogs, followers, and following data in parallel
        const [blogsRes, followersRes, followingRes] = await Promise.all([
          BlogService.getUserBlogs(),
          followService.getFollowers(currentUser.id),
          followService.getFollowing(currentUser.id),
        ]);

        setBlogs(Array.isArray(blogsRes.blogs) ? blogsRes.blogs : []);
        setStats({
          followers: followersRes?.length || 0,
          following: followingRes?.length || 0,
        });
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
        showError("Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Menu handling logic from blog-list.jsx
  const handleMenuToggle = (event, blogId) => {
    if (openMenu === blogId) {
      setOpenMenu(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 144,
      });
      setOpenMenu(blogId);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-blog/${id}`);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm(
      "Are you sure you want to delete this blog?"
    );
    if (isConfirmed) {
      try {
        await BlogService.deleteBlog(id);
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        showSuccess("Blog deleted successfully!");
      } catch (err) {
        showError("Failed to delete the blog.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 mt-9 text-center text-gray-500 dark:text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 mt-9 space-y-8">
      {/* Profile Header */}
      <Card className="shadow-lg dark:bg-gray-800">
        <CardBody>
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-8">
            {currentUser?.profilePicture ? (
              <Avatar
                image={currentUser.profilePicture}
                size="xlarge"
                shape="circle"
                className="mb-4 h-[110px] w-[110px] md:mb-0"
              />
            ) : (
              <Avatar
                label={currentUser?.name?.[0]?.toUpperCase() || "A"}
                size="xlarge"
                shape="circle"
                className="mb-4 h-[110px] w-[110px] bg-indigo-500 text-4xl text-white md:mb-0"
              />
            )}
            <div className="flex-grow">
              <Typography
                variant="h4"
                color="blue-gray"
                className="dark:text-white"
              >
                {currentUser?.name}
              </Typography>
              <Typography
                color="gray"
                className="text-md font-normal dark:text-gray-400 mt-1"
              >
                {currentUser?.email}
              </Typography>
              <div className="flex justify-center md:justify-start gap-6 mt-4 text-gray-700 dark:text-gray-300">
                <div className="text-center">
                  <DocumentTextIcon className="w-6 h-6 mx-auto text-blue-gray-400" />
                  <Typography variant="h6">{blogs.length}</Typography>
                  <Typography variant="small" className="font-normal">
                    Posts
                  </Typography>
                </div>
                <div className="text-center">
                  <UsersIcon className="w-6 h-6 mx-auto text-blue-gray-400" />
                  <Typography variant="h6">{stats.followers}</Typography>
                  <Typography variant="small" className="font-normal">
                    Followers
                  </Typography>
                </div>
                <div className="text-center">
                  <UserCircleIcon className="w-6 h-6 mx-auto text-blue-gray-400" />
                  <Typography variant="h6">{stats.following}</Typography>
                  <Typography variant="small" className="font-normal">
                    Following
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* User's Blog List (reusing layout from blog-list.jsx) */}
      <div className="bg-white rounded-xl shadow-md dark:bg-gray-800 p-4 sm:p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          My Blogs
        </h2>
        {/* This section is a copy of your blog-list.jsx for consistency */}
        <div className="hidden overflow-hidden border border-gray-200 rounded-lg md:block dark:border-gray-700">
          <table className="w-full text-left border-collapse">
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
                  <td className="flex items-center gap-3 px-6 py-4">
                    {blog.attachedImages?.length > 0 &&
                    blog.attachedImages[0].data ? (
                      <img
                        src={`data:${blog.attachedImages[0].contentType};base64,${blog.attachedImages[0].data}`}
                        alt={blog.blogTitle}
                        className="object-cover w-12 h-12 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 text-gray-500 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-400">
                        📷
                      </div>
                    )}
                    <Link to={`/dashboard/blog-viewer/${blog._id}`}>
                      <span className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                        {blog.blogTitle}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {blog.blogType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
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
        <div className="space-y-4 md:hidden">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="relative p-4 bg-gray-50 rounded-lg shadow dark:bg-gray-700/50"
            >
              <div className="flex items-start gap-4">
                {blog.attachedImages?.length > 0 &&
                blog.attachedImages[0].data ? (
                  <img
                    src={`data:${blog.attachedImages[0].contentType};base64,${blog.attachedImages[0].data}`}
                    alt={blog.blogTitle}
                    className="flex-shrink-0 object-cover w-16 h-16 rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 text-gray-500 bg-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-400">
                    📷
                  </div>
                )}
                <div className="flex-grow">
                  <Link to={`/dashboard/blog-viewer/${blog._id}`}>
                    <h3 className="pr-8 text-md font-semibold text-blue-600 hover:underline dark:text-blue-400">
                      {blog.blogTitle}
                    </h3>
                  </Link>
                  <span className="inline-block px-2 py-1 mt-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    {blog.blogType}
                  </span>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
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
    </div>
  );
}

export default ProfilePage;
