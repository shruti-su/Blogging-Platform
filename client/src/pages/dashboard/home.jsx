import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import BlogService from "@/services/api/blog";
import VoteService from "@/services/api/vote";
import ReportService from "@/services/api/report";
import { sweetAlert } from "@/components/SweetAlert/SweetAlert";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as SolidHandThumbUpIcon,
  HandThumbDownIcon as SolidHandThumbDownIcon,
} from "@heroicons/react/24/solid";

const BlogCard = ({ blog, onVoteUpdate, onMenuToggle }) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-300 flex flex-col">
      <div className="flex justify-between items-start p-4">
        {/* Left side content */}
        <div className="flex-grow pr-4">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
            <div>
              <Link to={`/dashboard/user/${blog.author._id}`}>
                <p className="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  {blog.author.name}
                </p>
              </Link>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Blog Title & Subtitle */}
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

        {/* Right side image and menu button */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          {blog.attachedImages?.length > 0 && (
            <img
              src={`data:${blog.attachedImages[0].contentType};base64,${blog.attachedImages[0].data}`}
              alt={blog.blogTitle}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle(e, blog._id);
            }}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
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
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col">
    <div className="flex justify-between items-start p-4 flex-grow">
      {/* Left side skeleton */}
      <div className="flex-grow pr-4">
        {/* Author skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      {/* Right side image skeleton */}
      <div className="flex-shrink-0">
        <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
    {/* Footer skeleton */}
    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
);

function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);
  const { showSuccess, showError } = sweetAlert();

  const [isReportDialogVisible, setReportDialogVisible] = useState(false);
  const [reportingBlog, setReportingBlog] = useState(null);
  const [reportReason, setReportReason] = useState("");

  const fetchFeed = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await BlogService.getFeedBlogs(pageNum);
      // On first page, replace the feed. For subsequent pages, append.
      if (pageNum === 1) {
        setFeed(response.blogs || []);
      } else {
        setFeed((prevFeed) => [...prevFeed, ...(response.blogs || [])]);
      }
      setHasMore(response.currentPage < response.totalPages);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
      setError("Could not load your feed. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  useEffect(() => {
    // Fetch the initial page of the feed when the component mounts.
    fetchFeed(1);
  }, [fetchFeed]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage);
  };

  const handleVoteUpdate = (blogId, voteData) => {
    setFeed((currentFeed) =>
      currentFeed.map((blog) =>
        blog._id === blogId ? { ...blog, ...voteData } : blog
      )
    );
  };

  const handleMenuToggle = (event, blogId) => {
    event.stopPropagation();
    if (openMenu === blogId) {
      setOpenMenu(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 144, // w-36
      });
      setOpenMenu(blogId);
    }
  };

  const openReportDialog = (blogId) => {
    const blogToReport = feed.find((b) => b._id === blogId);
    setReportingBlog(blogToReport);
    setReportDialogVisible(true);
    setOpenMenu(null);
  };

  const handleReportSubmit = async () => {
    if (!reportingBlog || !reportReason.trim()) {
      showError("Please provide a reason for the report.");
      return;
    }
    try {
      await ReportService.createReport({
        blogId: reportingBlog._id,
        reason: reportReason,
      });
      showSuccess("Blog reported successfully. Our team will review it.");
      setReportDialogVisible(false);
      setReportReason("");
      setReportingBlog(null);
    } catch (err) {
      showError(err.response?.data?.msg || "Failed to submit report.");
    }
  };

  if (loading && page === 1) {
    return (
      <div className="py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      {feed.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 ">
            {feed.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onVoteUpdate={handleVoteUpdate}
                onMenuToggle={handleMenuToggle}
              />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto max-w-2xl rounded-xl bg-white py-20 text-center shadow-md dark:bg-gray-800">
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

      {/* Menu Portal */}
      {openMenu &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 w-36 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <button
              onClick={() => openReportDialog(openMenu)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <FlagIcon className="h-4 w-4" /> Report
            </button>
          </div>,
          document.body
        )}

      {/* Report Dialog */}
      <Dialog
        visible={isReportDialogVisible}
        style={{ width: "32rem", borderRadius: "1rem" }}
        onHide={() => setReportDialogVisible(false)}
        modal
        closable={false} // disable default close button
        className="p-fluid dark:bg-gray-800 shadow-2xl rounded-2xl"
      >
        {/* Custom Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <i className="pi pi-flag text-purple-600"></i>
            Report Blog Post
          </h2>
          <button
            onClick={() => setReportDialogVisible(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <i className="pi pi-times text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 flex flex-col gap-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            You are reporting the blog:{" "}
            <strong className="text-gray-900 dark:text-white font-medium">
              {reportingBlog?.blogTitle}
            </strong>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Please provide a reason for reporting this content.
          </p>
          <InputTextarea
            rows={4}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="e.g., This content is spammy or harmful..."
            autoResize
            className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={() => setReportDialogVisible(false)}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
          />
          <Button
            label="Submit Report"
            icon="pi pi-check"
            onClick={handleReportSubmit}
            autoFocus
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition"
          />
        </div>
      </Dialog>
    </div>
  );
}

export default Home;
