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