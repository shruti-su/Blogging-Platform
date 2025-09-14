import { useEffect, useState } from "react";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";

import userService from "@/services/api/userService";
import followService from "@/services/api/followService";
import { useAuth } from "@/components/auth/AuthContext";
import { sweetAlert } from "@/components/SweetAlert/SweetAlert";

const SkeletonUserCard = () => (
  <div className="shadow-lg dark:bg-gray-800 rounded-xl p-4 animate-pulse flex items-center justify-between md:flex-col md:p-6">
    <div className="flex items-center gap-4 md:flex-col">
      <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 md:w-24 md:h-24 md:mb-4"></div>
      <div className="md:text-center">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 md:w-32"></div>
      </div>
    </div>
    <div className="h-9 bg-gray-300 dark:bg-gray-700 rounded-md w-28 md:mt-4"></div>
  </div>
);

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = sweetAlert();

  const getHighResGooglePhoto = (url) => {
    if (url && url.includes("googleusercontent.com") && url.includes("=")) {
      return url.split("=")[0] + "=s256-c";
    }
    return url;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // This call is authenticated on the server via token.
        // It's safe to call as long as the user is on this page (which is protected).
        const usersPromise = userService.getAllUsers();

        // This call depends on the user object being available client-side.
        const followingPromise =
          currentUser && currentUser.id
            ? followService.getFollowing(currentUser.id)
            : Promise.resolve([]); // Resolve with empty array if no user yet.

        const [usersRes, followingRes] = await Promise.all([
          usersPromise,
          followingPromise,
        ]);

        setUsers(usersRes || []);
        const followingIds = new Set((followingRes || []).map((u) => u._id));
        setFollowing(followingIds);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        showError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleFollow = async (userId) => {
    try {
      await followService.followUser(userId);
      setFollowing((prev) => new Set(prev).add(userId));
      showSuccess("Successfully followed user!");
    } catch (err) {
      console.error("❌ Error following user:", err);
      showError(err.response?.data?.msg || "Could not follow user.");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await followService.unfollowUser(userId);
      setFollowing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      showSuccess("Successfully unfollowed user!");
    } catch (err) {
      console.error("❌ Error unfollowing user:", err);
      showError(err.response?.data?.msg || "Could not unfollow user.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 mt-9 sm:p-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-72 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonUserCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mt-9 sm:p-6">
      <Typography
        variant="h4"
        color="blue-gray"
        className="mb-6 dark:text-white"
      >
        Discover Other Users
      </Typography>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
        {users.map((user) => (
          <Card key={user._id} className="shadow-lg dark:bg-gray-800">
            <CardBody className="flex items-center justify-between p-4 md:flex-col md:items-center md:text-center md:p-6">
              <div className="flex items-center gap-4 md:flex-col">
                {user.profilePicture ? (
                  <img
                    src={
                      user.profilePicture.startsWith("http")
                        ? getHighResGooglePhoto(user.profilePicture)
                        : user.profilePicture
                    }
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-blue-gray-100 md:w-24 md:h-24 md:mb-4"
                  />
                ) : (
                  <div className="relative inline-flex items-center justify-center h-16 w-16 overflow-hidden bg-indigo-500 rounded-full md:w-24 md:h-24 md:mb-4 border-2 border-blue-gray-100">
                    <span className="font-medium text-white text-2xl md:text-4xl">
                      {user.name?.[0]?.toUpperCase() || "A"}
                    </span>
                  </div>
                )}
                <div>
                  <Link to={`/dashboard/user/${user._id}`}>
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      {user.name}
                    </Typography>
                  </Link>
                  <Typography
                    color="gray"
                    className="text-sm font-normal dark:text-gray-400 "
                  >
                    {user.email}
                  </Typography>
                </div>
              </div>
              <div className="flex-shrink-0 md:mt-4">
                {following.has(user._id) ? (
                  <Button
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    className="flex items-center justify-center w-28 gap-2"
                    onClick={() => handleUnfollow(user._id)}
                  >
                    <UserMinusIcon className="w-4 h-4" /> Unfollow
                  </Button>
                ) : (
                  <Button
                    color="blue"
                    size="sm"
                    className="flex items-center justify-center w-28 gap-2"
                    onClick={() => handleFollow(user._id)}
                  >
                    <UserPlusIcon className="w-4 h-4" /> Follow
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      {users.length === 0 && !loading && (
        <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
          No other users to show right now.
        </div>
      )}
    </div>
  );
}
