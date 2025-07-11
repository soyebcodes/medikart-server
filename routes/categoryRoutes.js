const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const upload = require("../middlewares/upload"); 


// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// GET a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create category with image upload
router.post("/", upload.single("categoryImage"), async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName || !req.file) {
    return res.status(400).json({ message: "Category name and image are required" });
  }

  try {
    const existing = await Category.findOne({ categoryName });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    // req.file.path contains Cloudinary image URL
    const newCategory = new Category({
      categoryName,
      categoryImage: req.file.path, // store the Cloudinary URL
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a category by ID with image upload
router.put("/:id", upload.single("categoryImage"), async (req, res) => {
  const { categoryName } = req.body;
  const updateData = { categoryName };

  if (req.file) {
    updateData.categoryImage = req.file.path; // Cloudinary URL
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// DELETE a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
