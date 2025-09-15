const { validationResult } = require("express-validator");
const Category = require("../models/category");
const Blog = require("../models/blogs");

// Controller to add a new category
exports.addCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
        // Check if category already exists (case-insensitive)
        let category = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (category) {
            return res.status(400).json({ error: "Category with this name already exists." });
        }

        const newCategory = new Category({
            name,
        });

        await newCategory.save();
        res.status(201).json({ message: "Category added successfully!", category: newCategory });
    } catch (err) {
        console.error("❌ Error adding category:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to get all active categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 }); // Get active categories, sorted by name
        res.status(200).json({ categories });
    } catch (err) {
        console.error("❌ Error fetching categories:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to update an existing category
exports.updateCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const { id } = req.params;

    try {
        let category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        // Check if another category with the same name already exists (case-insensitive)
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: id } // Exclude the current category from the check
        });

        if (existingCategory) {
            return res.status(400).json({ msg: 'A category with this name already exists.' });
        }

        category.name = name;
        await category.save();

        res.status(200).json({ message: 'Category updated successfully!', category });

    } catch (err) {
        console.error('❌ Error updating category:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found.' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to delete a category and handle its associated blogs
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    const { action, transferToId } = req.body; // action: 'delete' or 'transfer'

    try {
        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        const categoryName = categoryToDelete.name;
        const blogCount = await Blog.countDocuments({ blogType: categoryName });
        let transferToCategory = null; // For use in success message

        // If there are blogs in the category, an action is required.
        if (blogCount > 0) {
            if (action === 'delete') {
                // Option 2: Delete all blogs associated with this category
                await Blog.deleteMany({ blogType: categoryName });
            } else if (action === 'transfer') {
                // Option 1: Transfer all blogs to a new category
                if (!transferToId) {
                    return res.status(400).json({ msg: 'A target category ID must be provided for transfer.' });
                }
                if (transferToId === id) {
                    return res.status(400).json({ msg: 'Cannot transfer blogs to the category being deleted.' });
                }

                transferToCategory = await Category.findById(transferToId);
                if (!transferToCategory) {
                    return res.status(404).json({ msg: 'Target category for transfer not found.' });
                }

                // Update blogs to point to the new category name
                await Blog.updateMany(
                    { blogType: categoryName },
                    { $set: { blogType: transferToCategory.name } }
                );
            } else {
                // If blogs exist but no action is specified, inform the client.
                return res.status(400).json({
                    error: `This category has ${blogCount} associated blogs. You must specify an action.`,
                    requiresAction: true,
                    blogCount,
                });
            }
        }

        // After handling associated blogs, permanently delete the category
        await categoryToDelete.deleteOne();

        let message = `Category '${categoryName}' was deleted successfully.`;
        if (blogCount > 0 && action === 'delete') {
            message = `Category '${categoryName}' and its ${blogCount} associated blogs were deleted.`;
        } else if (blogCount > 0 && action === 'transfer') {
            message = `${blogCount} blogs were transferred to '${transferToCategory.name}' and category '${categoryName}' was deleted.`;
        }

        res.status(200).json({ message });

    } catch (err) {
        console.error('❌ Error deleting category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};