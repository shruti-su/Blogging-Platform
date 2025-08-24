import { useLocation } from "react-router-dom";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button"; // optional for nicer buttons

function EditBlog() {
  const location = useLocation();
  const { title: initialTitle, category: initialCategory } =
    location.state || {};
  const [title, setTitle] = useState(initialTitle || "");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(initialCategory || "");
  const [thumbnail, setThumbnail] = useState(null);

  const [previewVisible, setPreviewVisible] = useState(false);

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

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              label="👀 Preview"
              className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-purple-600 transition duration-300 border-2 border-purple-300 rounded-lg hover:bg-purple-50 sm:w-1/2"
              onClick={() => setPreviewVisible(true)}
            />
            <button
              type="submit"
              className="w-1/2 py-3 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
            >
              ✅ Save & Publish
            </button>
          </div>
        </form>
      </div>

      {/* Preview Dialog */}
      <Dialog
        header="📖 Blog Preview"
        visible={previewVisible}
        style={{ width: "70vw" }}
        modal
        onHide={() => setPreviewVisible(false)}
      >
        <div className="space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {title || "Untitled Blog"}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          )}

          {/* Category */}
          {category && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📂 {category}
            </p>
          )}

          {/* Thumbnail Preview */}
          {thumbnail && (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="Thumbnail Preview"
              className="object-cover w-full rounded-lg max-h-64"
            />
          )}

          {/* Content */}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default EditBlog;
