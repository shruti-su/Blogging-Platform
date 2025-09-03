import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarIcon,
  ShareIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import BlogService from "@/services/api/blog";
import VoteService from "@/services/api/vote";
import CommentService from "@/services/api/comment";

export default function BlogView() {
  const { id } = useParams(); // Get the 'id' from the URL parameter
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  // New state for social features
  const [votes, setVotes] = useState({ likes: 0, dislikes: 0, userVote: null });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch blog, votes, and comments in parallel
        const [blogRes, votesRes, commentsRes] = await Promise.all([
          BlogService.getBlogById(id),
          VoteService.getVotes(id),
          CommentService.getComments(id),
        ]);

        setBlog(blogRes.blog);
        setVotes(votesRes);
        setComments(commentsRes.comments);
        setError(null);
      } catch (err) {
        console.error(`❌ Error fetching blog data for id ${id}:`, err);
        setError(
          "Failed to load the blog and its details. It might not exist."
        );
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
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

  const handleVote = async (type) => {
    try {
      const updatedVotes = await VoteService.castVote(id, type);
      setVotes(updatedVotes);
    } catch (err) {
      console.error("Error casting vote:", err);
      // Optionally show an error to the user
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await CommentService.postComment(id, newComment);
      setComments([res.comment, ...comments]); // Add new comment to the top
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setIsSubmitting(false);
    }
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
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">
        {blog.blogTitle}
      </h1>
      <div className="flex flex-row justify-between items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400  dark:border-gray-700 mt-2 mb-4 border-b">
        {blog.author && (
          <div className="flex items-center gap-2">
            <UserCircleIcon className="w-5 h-5" />
            <span className="font-medium">{blog.author.name}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          <span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
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

          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
            {blog.blogSubTitle}
          </p>
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: blog.blogContent }}
      />

      {/* --- Vote and Comment Section --- */}
      <div className="mt-8 pt-6 border-t dark:border-gray-700 ">
        {/* Vote Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Did you find this post helpful?
            </span>
            <button
              onClick={() => handleVote("like")}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                votes.userVote === "like"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <HandThumbUpIcon className="w-5 h-5" />
              {votes.likes}
            </button>
            <button
              onClick={() => handleVote("dislike")}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                votes.userVote === "dislike"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <HandThumbDownIcon className="w-5 h-5" />
              {votes.dislikes}
            </button>
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

        {/* Comment Form */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Leave a Comment
          </h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows="4"
              disabled={isSubmitting}
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="mt-3 px-6 py-2 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Comments ({comments.length})
          </h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-900/50"
              >
                <UserCircleIcon className="w-10 h-10 text-gray-400 shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {comment.author?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

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
