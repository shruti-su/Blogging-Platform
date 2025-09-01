const { validationResult } = require("express-validator");
const Blog = require("../models/blogs");

exports.addBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { blogType, blogTitle, blogSubTitle, blogContent, attachedImages } = req.body;

    try {
        let imagesToStore = [];
        // If images are provided (as base64 strings), convert them to Buffers
        if (attachedImages && Array.isArray(attachedImages)) {
            imagesToStore = attachedImages.map(img => {
                if (img.data && img.contentType) {
                    const imageBuffer = Buffer.from(img.data, 'base64');
                    return { data: imageBuffer, contentType: img.contentType };
                }
                return null;
            }).filter(img => img !== null); // Filter out any invalid entries
        }

        const newBlog = new Blog({
            blogType,
            blogTitle,
            blogSubTitle,
            blogContent,
            attachedImages: imagesToStore,
        });

        await newBlog.save();
        const blogResponse = newBlog.toObject();
        delete blogResponse.attachedImages; // Avoid sending large image buffers in the response
        res.status(201).json({ message: "Blog added successfully!", blog: blogResponse });
    } catch (err) {
        console.error("❌ Error adding blog:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        // Get active blogs, sorted. Exclude large content field for list view efficiency.
        const blogsFromDB = await Blog.find({ isActive: true })
            .select('-blogContent')
            .sort({ createdAt: -1 });
        // Manually convert Buffer to base64 string before sending to client
        const blogs = blogsFromDB.map(blog => {
            const blogObject = blog.toObject();
            if (blogObject.attachedImages && blogObject.attachedImages.length > 0) {
                blogObject.attachedImages = blogObject.attachedImages.map(img => {
                    if (img.data instanceof Buffer) {
                        return { ...img, data: img.data.toString('base64') };
                    }
                    return img;
                });
            }
            return blogObject;
        });

        res.status(200).json({ blogs });
    } catch (err) {
        console.error("❌ Error fetching blogs:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blogFromDB = await Blog.findById(req.params.id);

        if (!blogFromDB || !blogFromDB.isActive) {
            return res.status(404).json({ error: "Blog not found." });
        }

        // Manually convert Buffer to base64 string before sending to client
        const blogObject = blogFromDB.toObject();
        if (blogObject.attachedImages && blogObject.attachedImages.length > 0) {
            blogObject.attachedImages = blogObject.attachedImages.map(img => {
                if (img.data instanceof Buffer) {
                    return { ...img, data: img.data.toString('base64') };
                }
                return img;
            });
        }

        res.status(200).json({ blog: blogObject });
    } catch (err) {
        console.error(`❌ Error fetching blog with ID ${req.params.id}:`, err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Blog not found." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { blogTitle, blogSubTitle, blogContent, blogType, attachedImages } = req.body;

    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found." });
        }

        const blogFields = {
            blogTitle,
            blogSubTitle,
            blogContent,
            blogType,
            updatedAt: Date.now(),
        };

        if (attachedImages && Array.isArray(attachedImages)) {
            blogFields.attachedImages = attachedImages.map(img => {
                if (img.data && img.contentType) {
                    const imageBuffer = Buffer.from(img.data, 'base64');
                    return { data: imageBuffer, contentType: img.contentType };
                }
                return null;
            }).filter(img => img !== null);
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: blogFields },
            { new: true }
        );

        const blogResponse = updatedBlog.toObject();
        if (blogResponse.attachedImages) {
            delete blogResponse.attachedImages;
        }

        res.status(200).json({ message: "Blog updated successfully!", blog: blogResponse });
    } catch (err) {
        console.error(`❌ Error updating blog with ID ${req.params.id}:`, err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Blog not found." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog not found." });
        }

        res.status(200).json({ message: "Blog deleted successfully!" });

    } catch (err) {
        console.error("❌ Error deleting blog:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
