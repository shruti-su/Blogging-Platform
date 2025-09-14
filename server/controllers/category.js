const { validationResult } = require("express-validator");
const Category = require("../models/category");

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

// Controller to "delete" a category (soft delete)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: false } },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (err) {
        console.error('❌ Error deleting category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};