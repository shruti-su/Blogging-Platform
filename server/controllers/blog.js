const { validationResult } = require("express-validator");
const Blog = require("../models/blogs");

exports.addblog = async (req, res) => {
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

exports.getblog = async (req, res) => {
    try {
        const blogsFromDB = await Blog.find({ isActive: true }).sort({ createdAt: -1 }); // Get active blogs, sorted by creation date

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

        res.status(200).json({ blogs: blogs });
    } catch (err) {
        console.error("❌ Error fetching blogs:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
