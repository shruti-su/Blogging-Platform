// src/pages/dashboard/blog/blog-edit.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "primereact/editor";
import { sweetAlert } from "../../../components/SweetAlert/SweetAlert";
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

export default function BlogEditPage() {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = sweetAlert();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const fileInputRef = useRef(null);

  // Load categories and the specific blog data to edit
  useEffect(() => {
    const fetchEditData = async () => {
      if (!id) {
        showError("No blog ID provided.");
        navigate("/dashboard/blog-list");
        return;
      }
      setLoading(true);
      try {
        // Fetch both categories and the blog data in parallel for efficiency
        const [catData, blogRes] = await Promise.all([
          CategoryService.getAllCategories(),
          BlogService.getBlogById(id),
        ]);

        const fetchedCategories = catData?.categories || [];
        setCategories(fetchedCategories);

        const blogData = blogRes.blog;
        setTitle(blogData.blogTitle);
        setSubtitle(blogData.blogSubTitle);
        setContent(blogData.blogContent);

        // Set existing image for preview
        if (blogData.attachedImages && blogData.attachedImages.length > 0) {
          setExistingImageUrl(
            `data:${blogData.attachedImages[0].contentType};base64,${blogData.attachedImages[0].data}`
          );
        }

        // Find and set the full category object for the dropdown
        const blogCategory = fetchedCategories.find(
          (c) => c.name === blogData.blogType
        );
        if (blogCategory) {
          setCategory(blogCategory);
        }
      } catch (e) {
        console.error("Failed to load blog data for editing", e);
        showError("Failed to load blog data. It might not exist.");
        navigate("/dashboard/blog-list");
      } finally {
        setLoading(false);
      }
    };
    fetchEditData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
    if (selectedFile.size > maxSizeInBytes) {
      showWarning(
        "Image is too large. Please choose a file smaller than 1 MB."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
    } else {
      setFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setExistingImageUrl(null);
    setFile(null);
    setIsImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!subtitle.trim()) newErrors.subtitle = "Subtitle is required.";
    if (!category) newErrors.category = "Category must be selected.";
    if (!content || content.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      newErrors.content = "Blog content cannot be empty.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    let attachedImages = [];
    if (file) {
      try {
        const base64String = await toBase64(file);
        const parts = base64String.split(";base64,");
        const contentType = parts[0].split(":")[1];
        const data = parts[1];
        attachedImages.push({ data, contentType });
      } catch (error) {
        showError("Failed to process cover image.");
        return;
      }
    }

    const payload = {
      blogTitle: title,
      blogSubTitle: subtitle,
      blogContent: content,
      blogType: category?.name,
    };

    // Conditionally add attachedImages to the payload
    if (file) {
      // A new file was uploaded, so include it.
      payload.attachedImages = attachedImages;
    } else if (isImageRemoved) {
      // The existing image was removed, send an empty array.
      payload.attachedImages = [];
    }

    try {
      await BlogService.updateBlog(id, payload);
      showSuccess("Blog updated successfully!");
      navigate(`/dashboard/blog-viewer/${id}`); // Navigate back to the view page
    } catch (error) {
      const apiError =
        error.response?.data?.errors?.[0]?.msg || "Update failed.";
      showError(apiError);
    }
  };

  if (loading) {
    return (
      <div className="p-6 mt-9 text-center text-gray-500 dark:text-gray-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] w-full mt-9 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-2xl">✏️</span>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Edit Blog Post
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* All form fields are similar to create-blog.jsx */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}

          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Blog Subtitle..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
          )}

          <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <Editor
              value={content}
              onTextChange={(e) => setContent(e.htmlValue)}
              style={{ minHeight: "180px" }}
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}

          <select
            value={category?._id || ""}
            onChange={(e) =>
              setCategory(
                categories.find((c) => c._id === e.target.value) || null
              )
            }
            className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover Image
            </label>
            {existingImageUrl && !file && (
              <div className="mb-4">
                <img
                  src={existingImageUrl}
                  alt="Current cover"
                  className="h-40 w-auto rounded-lg object-cover"
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {existingImageUrl || file ? "Change Image" : "Upload Image"}
              </button>
              {(existingImageUrl || file) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="rounded-xl border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Remove Image
                </button>
              )}
            </div>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
              {file ? file.name : "No new file chosen. Max 1MB."}
            </span>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              💾 Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
