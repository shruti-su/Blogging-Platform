import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";

import userService from "@/services/api/userService";
import followService from "@/services/api/followService";
import { useAuth } from "@/components/auth/AuthContext";
import { sweetAlert } from "@/components/SweetAlert/SweetAlert";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = sweetAlert();

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
      <div className="p-6 mt-9 text-center text-gray-500 dark:text-gray-400">
        Loading users...
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <Card key={user._id} className="shadow-lg dark:bg-gray-800">
            <CardBody className="flex flex-col items-center text-center">
              <Avatar
                src={`https://i.pravatar.cc/150?u=${user._id}`}
                alt={user.name}
                size="xl"
                className="mb-4 border-2 border-blue-gray-100"
              />
              <Typography
                variant="h6"
                color="blue-gray"
                className="dark:text-white"
              >
                {user.name}
              </Typography>
              <Typography
                color="gray"
                className="text-sm font-normal dark:text-gray-400"
              >
                {user.email}
              </Typography>
              <div className="mt-4">
                {following.has(user._id) ? (
                  <Button
                    variant="outlined"
                    color="blue-gray"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleUnfollow(user._id)}
                  >
                    <UserMinusIcon className="w-4 h-4" /> Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="gradient"
                    color="blue"
                    size="sm"
                    className="flex items-center gap-2"
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
