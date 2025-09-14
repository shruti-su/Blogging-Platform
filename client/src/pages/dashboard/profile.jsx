import { useEffect, useState, useRef } from "react";
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
  CameraIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

import { useAuth } from "@/components/auth/AuthContext";
import { Avatar } from "primereact/avatar";

import BlogService from "@/services/api/blog";
import followService from "@/services/api/followService";
import AuthService from "@/services/api/auth";
import { sweetAlert } from "@/components/SweetAlert/SweetAlert";

export const ProfilePageSkeleton = () => (
  <div className="p-4 sm:p-6 mt-9 space-y-8 animate-pulse">
    {/* Profile Header Skeleton */}
    <div className="shadow-lg dark:bg-gray-800 rounded-xl p-6">
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-8">
        <div className="relative flex-shrink-0 mb-4 md:mb-0">
          <div className="h-[110px] w-[110px] bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex-grow w-full">
          <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto md:mx-0"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto md:mx-0 mt-2"></div>
          <div className="flex justify-center md:justify-start gap-6 mt-4">
            <div className="text-center w-16">
              <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-10/12 bg-gray-300 dark:bg-gray-700 rounded mx-auto mt-1"></div>
            </div>
            <div className="text-center w-16">
              <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mx-auto mt-1"></div>
            </div>
            <div className="text-center w-16">
              <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mx-auto mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Blog List Skeleton */}
    <div className="bg-white rounded-xl shadow-md dark:bg-gray-800 p-4 sm:p-6">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6"></div>
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="w-full text-left border-collapse">
          <div className="flex bg-gray-200 dark:bg-gray-700 p-3 rounded-t-lg">
            <div className="w-2/5 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
            <div className="w-1/5 h-4 bg-gray-400 dark:bg-gray-600 rounded ml-6"></div>
            <div className="w-1/5 h-4 bg-gray-400 dark:bg-gray-600 rounded ml-6"></div>
            <div className="w-1/5 h-4 bg-gray-400 dark:bg-gray-600 rounded ml-6"></div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-4">
                <div className="flex items-center gap-3 w-2/5">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5 ml-6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5 ml-6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5 ml-6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Card Skeleton */}
      <div className="space-y-4 md:hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-gray-50 rounded-lg shadow dark:bg-gray-700/50 flex items-start gap-4"
          >
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export function ProfilePage() {
  const { user: authUser } = useAuth(); // Renamed to avoid confusion
  const [profile, setProfile] = useState(null); // State for full profile data
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true); // Will now wait for profile state
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const { showSuccess, showError, showConfirm } = sweetAlert();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const getHighResGooglePhoto = (url) => {
    if (url && url.includes("googleusercontent.com") && url.includes("=")) {
      return url.split("=")[0] + "=s256-c";
    }
    return url;
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      showError(`File is too large. Max size is ${maxSizeInMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        // 1. Upload the new picture
        await AuthService.uploadProfilePicture(base64String);
        // 2. Re-fetch the entire profile to get the updated picture
        const freshProfile = await AuthService.getCurrentUser();
        setProfile(freshProfile); // This triggers the "hot reload"
        showSuccess("Profile picture updated successfully!");
      } catch (err) {
        console.error("Failed to upload profile picture:", err);
        showError(
          err.response?.data?.msg || "Failed to upload profile picture."
        );
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      showError("Failed to read the selected file.");
    };
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      // Entering edit mode, populate form with current profile data
      setEditData({ name: profile.name, email: profile.email });
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      showError("Name and email cannot be empty.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editData.email)) {
      showError("Please enter a valid email address.");
      return;
    }

    try {
      const updatedProfile = await AuthService.updateProfile(editData);
      setProfile(updatedProfile); // Update local state with response from server
      setIsEditing(false);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      showError(err.response?.data?.msg || "Failed to update profile.");
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  useEffect(() => {
    if (!authUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile, blogs, followers, and following data in parallel
        const [profileRes, blogsRes, followersRes, followingRes] =
          await Promise.all([
            AuthService.getCurrentUser(),
            BlogService.getUserBlogs(),
            followService.getFollowers(authUser.id),
            followService.getFollowing(authUser.id),
          ]);

        setProfile(profileRes);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

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

  if (loading || !profile) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 mt-9 space-y-8">
      {/* Profile Header */}
      <Card className="shadow-lg dark:bg-gray-800">
        <CardBody>
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-8">
            <div className="relative flex-shrink-0 mb-4 md:mb-0">
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile?.name || "Profile"}
                  className="h-[110px] w-[110px] rounded-full object-cover"
                />
              ) : (
                <Avatar
                  label={profile?.name?.[0]?.toUpperCase() || "A"}
                  size="xlarge"
                  shape="circle"
                  className="h-[110px] w-[110px] bg-indigo-500 text-4xl text-white"
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-1 right-1 p-2 text-white bg-gray-700 rounded-full shadow-md hover:bg-gray-600 transition-colors"
                title="Change profile picture"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow w-full">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  {isEditing ? (
                    <div className="space-y-4 max-w-sm">
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full p-2 text-xl font-bold bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full p-2 text-md bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <>
                      <Typography
                        variant="h4"
                        color="blue-gray"
                        className="dark:text-white"
                      >
                        {profile?.name}
                      </Typography>
                      <Typography
                        color="gray"
                        className="text-md font-normal dark:text-gray-400 mt-1"
                      >
                        {profile?.email}
                      </Typography>
                    </>
                  )}
                </div>
                <button
                  onClick={handleEditToggle}
                  className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                  title={isEditing ? "Cancel Edit" : "Edit Profile"}
                >
                  {isEditing ? (
                    <XMarkIcon className="w-6 h-6" />
                  ) : (
                    <PencilIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {isEditing && (
                <div className="mt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              )}

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
