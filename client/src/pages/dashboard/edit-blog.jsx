// src/pages/blog/BlogEditor.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// If you already have a service, you can import it and uncomment the fetch in useEffect
import CategoryService from "@/services/api/category";

export default function EditBlog() {
  const location = useLocation();
  const { title: initialTitle, category: initialCategoryName } =
    location.state || {};

  const [title, setTitle] = useState(initialTitle || "");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const [file, setFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Example: load categories from API
  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        const fetchedCategories = data?.categories || [];
        setCategories(fetchedCategories);

        // If an initial category name was passed, find the corresponding category object
        if (initialCategoryName && fetchedCategories.length > 0) {
          const selectedCategory = fetchedCategories.find(
            (c) => c.name === initialCategoryName
          );
          if (selectedCategory) {
            setCategory(selectedCategory);
          }
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };
    fetchAndSetData();
  }, [initialCategoryName]);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
      "blockquote",
      "code-block",
      "color",
      "background",
      "align",
    ],
    []
  );

  function handleChooseFile() {
    fileInputRef.current?.click();
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Build payload
    const payload = {
      title,
      subtitle,
      content,
      categoryId: category?._id ?? null,
      coverImage: file,
    };
    // TODO: send to API
    console.log("Submitting blog payload:", payload);
    // Reset or navigate on success as needed
  }

  return (
    <div className="min-h-[calc(100vh-140px)] w-full">
      {/* Optional dark-mode overrides for Quill */}
      <style>{`
        .dark .ql-toolbar.ql-snow {
          background: #1f2937; /* gray-800 */
          border-color: #374151;  /* gray-700 */
          color: #e5e7eb; /* gray-200 */
        }
        .dark .ql-container.ql-snow {
          border-color: #374151;
        }
        .dark .ql-editor {
          color: #e5e7eb;
          background: #111827; /* gray-900 */
        }
        .ql-editor {
          min-height: 180px;
        }
      `}</style>

      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Blog Editor
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700
                       dark:bg-gray-800 dark:text-gray-100"
          />

          {/* Subtitle */}
          <input
            type="text"
            placeholder="Enter a subtitle..."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700
                       dark:bg-gray-800 dark:text-gray-100"
          />

          {/* Editor */}
          <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select a category
            </label>
            <div className="relative">
              <select
                value={category?._id || ""}
                onChange={(e) =>
                  setCategory(
                    categories.find((c) => c._id === e.target.value) || null
                  )
                }
                className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3
                           pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="" disabled>
                  Choose category…
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                ▼
              </span>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover image
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleChooseFile}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
                           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500
                           dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Upload Cover Image
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {file ? file.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="w-full rounded-xl border border-purple-500 px-5 py-3 font-medium text-purple-600
                         hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500
                         dark:text-purple-400 dark:hover:bg-purple-900/20"
            >
              👀 Preview
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white
                         shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              ✅ Save & Publish
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Preview
              </h2>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {title || "Untitled post"}
              </h3>
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
              )}
              {category && (
                <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  {category.name}
                </span>
              )}
            </div>

            {file && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Cover"
                  className="max-h-64 w-full rounded-xl object-cover"
                />
              </div>
            )}

            <div className="prose prose-purple mt-6 max-w-none dark:prose-invert">
              <div
                className="ql-snow ql-container rounded-xl border border-gray-200 dark:border-gray-700"
                style={{ border: "none" }}
              >
                <div
                  className="ql-editor"
                  // Render Quill HTML safely
                  dangerouslySetInnerHTML={{
                    __html: content || "<p><em>No content yet…</em></p>",
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
