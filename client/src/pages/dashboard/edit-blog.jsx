// src/pages/blog/BlogEditor.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sweetAlert } from "../../components/SweetAlert/SweetAlert";
// If you already have a service, you can import it and uncomment the fetch in useEffect
import CategoryService from "@/services/api/category";
import BlogService from "@/services/api/blog";

// Helper function to convert a file to a base64 string
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function CreateBlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = sweetAlert();
  const { title: initialTitle, category: initialCategoryName } =
    location.state || {};

  const [title, setTitle] = useState(initialTitle || "");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [file, setFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

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

  // Enable spell check on the Quill editor after it mounts
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // By setting spellcheck to true, we enable the browser's native spell checker
      // on the editor's content-editable area.
      editor.root.setAttribute("spellcheck", "true");
    }
  }, []);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

    if (selectedFile.size > maxSizeInBytes) {
      showWarning(
        "The selected image is too large. Please choose a file smaller than 1 MB."
      );
      // Clear the file input so the user can select the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null); // Reset file state
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!subtitle.trim()) newErrors.subtitle = "Subtitle is required.";
    if (!category) newErrors.category = "Category must be selected.";
    // Check if Quill editor content is empty
    if (!content || content.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      newErrors.content = "Blog content cannot be empty.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({}); // Clear errors if validation passes

    let attachedImages = [];
    if (file) {
      try {
        const base64String = await toBase64(file);
        const parts = base64String.split(";base64,");
        const contentType = parts[0].split(":")[1];
        const data = parts[1];
        attachedImages.push({ data, contentType });
      } catch (error) {
        console.error("Error converting image to base64:", error);
        showError("Failed to process cover image. Please try another file.");
        return;
      }
    }

    // Construct payload to match backend expectations
    const payload = {
      blogTitle: title,
      blogSubTitle: subtitle,
      blogContent: content,
      blogType: category?.name, // Assumes blogType is the category name
      attachedImages: attachedImages,
    };

    try {
      await BlogService.addBlog(payload);
      showSuccess("Your blog has been published successfully.");
      navigate("/dashboard/Explore");
    } catch (error) {
      // Get a specific error message from the backend response
      const apiError =
        error.response?.data?.errors?.[0]?.msg ||
        "Please check the console for details.";
      console.error("Failed to publish blog:", error.response?.data || error);
      showError(apiError);
    }
  };

  function handleChooseFile() {
    fileInputRef.current?.click();
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
          <div>
            <input
              type="text"
              placeholder="Enter your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700
                       dark:bg-gray-800 dark:text-gray-100"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <input
              type="text"
              placeholder="Enter a subtitle..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700
                       dark:bg-gray-800 dark:text-gray-100"
            />
            {errors.subtitle && (
              <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
            )}
          </div>

          {/* Editor */}
          <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}

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
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
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
              onChange={handleFileChange}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl 
                    dark:bg-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Preview</h2>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">
                  {title || "Untitled post"}
                </h3>
                {subtitle && (
                  <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
                )}
                {category && (
                  <span
                    className="mt-2 inline-block rounded-full bg-purple-100 px-3 py-1 
                             text-xs font-medium text-purple-700 
                             dark:bg-purple-900/40 dark:text-purple-300"
                  >
                    {category.name}
                  </span>
                )}
              </div>

              {file && (
                <div>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Cover"
                    className="w-full max-h-72 object-cover rounded-xl shadow"
                  />
                </div>
              )}

              <div
                className="prose prose-purple max-w-none leading-relaxed dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: content || "<p><em>No content yet…</em></p>",
                }}
              />
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 
                     text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-purple-500
                     dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white 
                     hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
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
