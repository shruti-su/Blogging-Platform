import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PencilIcon, CalendarIcon, ShareIcon } from "@heroicons/react/24/solid";

import BlogService from "@/services/api/blog";

export default function BlogView() {
  const { id } = useParams(); // Get the 'id' from the URL parameter
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Assumes a getBlogById method exists in your service
        const res = await BlogService.getBlogById(id);
        setBlog(res.blog);
        setError(null);
      } catch (err) {
        console.error(`❌ Error fetching blog with id ${id}:`, err);
        setError("Failed to load the blog. It might not exist.");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]); // Re-run the effect if the id from the URL changes

  const handleShare = () => {
    setIsShareModalOpen(true);
    setCopySuccess(""); // Reset copy status when opening
  };

  const copyToClipboard = () => {
    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
      },
      (err) => {
        setCopySuccess("Failed!");
        console.error("Could not copy text: ", err);
        setTimeout(() => setCopySuccess(""), 2000);
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500 dark:text-gray-400">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500 dark:text-gray-400">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-9 bg-white rounded-xl shadow-md dark:bg-gray-800">
      {blog.attachedImages?.length > 0 && (
        <img
          src={`data:${blog.attachedImages[0].contentType};base64,${blog.attachedImages[0].data}`}
          alt={blog.blogTitle}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full dark:bg-purple-900/40 dark:text-purple-300">
            {blog.blogType}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {blog.blogTitle}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
            {blog.blogSubTitle}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-4 sm:mt-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
          >
            <ShareIcon className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-4 border-b dark:border-gray-700 pb-4 mb-4">
        <CalendarIcon className="w-5 h-5" />
        <span>
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: blog.blogContent }}
      />

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Share this Blog Post
            </h3>
            <p className="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
              Anyone with this link can view this post.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="w-24 px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {copySuccess || "Copy"}
              </button>
            </div>
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="w-full px-4 py-2 mt-4 text-gray-700 bg-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
