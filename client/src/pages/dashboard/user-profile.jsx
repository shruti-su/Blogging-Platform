import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import {
  UserCircleIcon,
  UsersIcon,
  DocumentTextIcon,
  UserPlusIcon,
  UserMinusIcon,
} from "@heroicons/react/24/solid";

import { useAuth } from "@/components/auth/AuthContext";
import { Avatar } from "primereact/avatar";

import BlogService from "@/services/api/blog";
import followService from "@/services/api/followService";
import AuthService from "@/services/api/auth";
import { sweetAlert } from "@/components/SweetAlert/SweetAlert";
import { ProfilePageSkeleton } from "./profile"; // Re-use skeleton

export function UserProfilePage() {
  const { userId } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = sweetAlert();

  const getHighResGooglePhoto = (url) => {
    if (url && url.includes("googleusercontent.com") && url.includes("=")) {
      return url.split("=")[0] + "=s256-c";
    }
    return url;
  };

  useEffect(() => {
    if (!userId || !authUser) return;

    // Redirect a regular user if they are viewing their own public profile.
    // Let admins view their own public profile page as-is.
    if (userId === authUser.id) {
      if (authUser.role === "user") {
        navigate("/dashboard/profile");
        return;
      }
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          profileRes,
          blogsRes,
          followersRes,
          followingRes,
          authFollowingRes,
        ] = await Promise.all([
          AuthService.getUserById(userId),
          BlogService.getBlogsByUserId(userId),
          followService.getFollowers(userId),
          followService.getFollowing(userId),
          followService.getFollowing(authUser.id), // To check if authUser follows this user
        ]);

        setProfile(profileRes);
        setBlogs(Array.isArray(blogsRes.blogs) ? blogsRes.blogs : []);
        setStats({
          followers: followersRes?.length || 0,
          following: followingRes?.length || 0,
        });

        const authFollowingIds = new Set(
          (authFollowingRes || [])
            .filter((user) => user) // Safely filter out any null/undefined entries
            .map((u) => u._id)
        );
        setIsFollowing(authFollowingIds.has(userId));
      } catch (err) {
        console.error("❌ Error fetching user profile data:", err);
        showError("Failed to load user profile. Please try again.");
        // Redirect to the appropriate user list based on the current layout.
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, authUser, navigate, location.pathname]);

  const handleFollow = async () => {
    try {
      await followService.followUser(userId);
      setIsFollowing(true);
      setStats((prev) => ({ ...prev, followers: prev.followers + 1 }));
      showSuccess("Successfully followed user!");
    } catch (err) {
      showError(err.response?.data?.msg || "Could not follow user.");
    }
  };

  const handleUnfollow = async () => {
    try {
      await followService.unfollowUser(userId);
      setIsFollowing(false);
      setStats((prev) => ({ ...prev, followers: prev.followers - 1 }));
      showSuccess("Successfully unfollowed user!");
    } catch (err) {
      showError(err.response?.data?.msg || "Could not unfollow user.");
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
                  src={
                    profile.profilePicture.startsWith("http")
                      ? getHighResGooglePhoto(profile.profilePicture)
                      : profile.profilePicture
                  }
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
            </div>
            <div className="flex-grow w-full">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
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
                </div>
                {isFollowing ? (
                  <Button
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleUnfollow}
                  >
                    <UserMinusIcon className="w-4 h-4" /> Unfollow
                  </Button>
                ) : (
                  <Button
                    color="blue"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleFollow}
                  >
                    <UserPlusIcon className="w-4 h-4" /> Follow
                  </Button>
                )}
              </div>

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

      {/* User's Blog List */}
      <div className="bg-white rounded-xl shadow-md dark:bg-gray-800 p-4 sm:p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {profile.name}'s Blogs
        </h2>
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
                    <Link to={`/auth/blog-viewer/${blog._id}`}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4 md:hidden">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="p-4 bg-gray-50 rounded-lg shadow dark:bg-gray-700/50"
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
                    <h3 className="text-md font-semibold text-blue-600 hover:underline dark:text-blue-400">
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
            </div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            <p>{profile.name} hasn't written any blogs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
