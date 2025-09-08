import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogService from "@/services/api/blog";
import VoteService from "@/services/api/vote";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as SolidHandThumbUpIcon,
  HandThumbDownIcon as SolidHandThumbDownIcon,
} from "@heroicons/react/24/solid";

const BlogCard = ({ blog, onVoteUpdate }) => {
  const handleVote = async (type) => {
    if (!blog._id) return;
    try {
      const { likes, dislikes, userVote } = await VoteService.castVote(
        blog._id,
        type
      );
      onVoteUpdate(blog._id, { likes, dislikes, userVote });
    } catch (err) {
      console.error("Failed to vote", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      {/* Card Header */}
      <div className="p-4 flex items-center gap-3 border-b dark:border-gray-700">
        <UserCircleIcon className="h-10 w-10 text-gray-400" />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {blog.author.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {blog.attachedImages?.length > 0 && (
          <img
            src={`data:${blog.attachedImages[0].contentType};base64,${blog.attachedImages[0].data}`}
            alt={blog.blogTitle}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {blog.blogTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {blog.blogSubTitle}
        </p>
        <Link
          to={`/dashboard/blog-viewer/${blog._id}`}
          className="inline-flex items-center gap-1 mt-4 font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          Read More <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex justify-between items-center">
          {/* Vote Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote("like")}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {blog.userVote === "like" ? (
                <SolidHandThumbUpIcon className="w-5 h-5 text-green-500" />
              ) : (
                <HandThumbUpIcon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{blog.likes}</span>
            </button>
            <button
              onClick={() => handleVote("dislike")}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              {blog.userVote === "dislike" ? (
                <SolidHandThumbDownIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HandThumbDownIcon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{blog.dislikes}</span>
            </button>
          </div>

          {/* Last Comment */}
          {blog.lastComment && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
              <p className="truncate">
                <span className="font-semibold">
                  {blog.lastComment.author.name}:
                </span>{" "}
                {blog.lastComment.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="p-4 flex items-center gap-3 border-b dark:border-gray-700">
      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
      </div>
    </div>
    <div className="p-4">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
    </div>
    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
);

function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await BlogService.getFeedBlogs();
        setFeed(response.blogs || []);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
        setError("Could not load your feed. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const handleVoteUpdate = (blogId, voteData) => {
    setFeed((currentFeed) =>
      currentFeed.map((blog) =>
        blog._id === blogId ? { ...blog, ...voteData } : blog
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {feed.length > 0 ? (
        <div className="space-y-8">
          {feed.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onVoteUpdate={handleVoteUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Your Feed is Quiet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Follow other users or write your first blog to see content here.
          </p>
          <Link to="/dashboard/all-users">
            <button className="mt-6 px-6 py-2 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700">
              Discover Users
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
