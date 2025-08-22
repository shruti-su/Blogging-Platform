import { useLocation } from "react-router-dom";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function EditBlog() {
  const location = useLocation();
  const { title: initialTitle, category: initialCategory } =
    location.state || {};
  const [title, setTitle] = useState(initialTitle || "");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(initialCategory || "");
  const [thumbnail, setThumbnail] = useState(null);
  return (
    <div className="flex justify-center px-4 py-36 dark:bg-slate-900">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          📝 Blog Editor
        </h1>

        <form className="space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title..."
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />

          {/* Subtitle */}
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter a subtitle..."
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />

          {/* Content */}
          <ReactQuill
            className="w-full px-4 py-3 text-gray-900 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Start writing your blog..."
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select a category</option>
            <option value="tech">💻 Technology</option>
            <option value="travel">✈️ Travel</option>
            <option value="food">🍔 Food</option>
            <option value="life">🌱 Lifestyle</option>
            <option value="edu">🎓 Education</option>
            <option value="business">💼 Business</option>
            <option value="health">❤️ Health</option>
            <option value="custom">✏️ Other</option>
          </select>

          {/* Thumbnail */}
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="block w-full text-sm text-gray-600 dark:text-gray-300"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
          >
            ✅ Save & Publish
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
