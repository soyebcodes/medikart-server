const express = require("express");
const router = express.Router();
const multer = require("multer"); // multer imported once at top
const upload = require("../middlewares/upload"); // your configured multer instance
const Category = require("../models/Category");
const Medicine = require("../models/Medicine");

// GET all categories with medicine count
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    const counts = await Medicine.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Map counts to an object for faster lookup
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    // Attach medicineCount to each category
    const categoriesWithCount = categories.map((cat) => ({
      ...cat._doc,
      medicineCount: countMap[cat.categoryName] || 0,
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST create category with image upload and multer error handling
router.post("/", (req, res, next) => {
  upload.single("categoryImage")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { categoryName } = req.body;
  console.log("POST / categoryName:", categoryName);
  console.log("POST / req.file:", req.file);

  if (!categoryName || !req.file) {
    return res.status(400).json({ message: "Category name and image are required" });
  }

  try {
    const existing = await Category.findOne({ categoryName });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryName,
      categoryImage: req.file.path,
    });

    const saved = await newCategory.save();
    console.log("Category saved:", saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// PUT update category with optional image upload and error handling
router.put(
  "/:id",
  (req, res, next) => {
    upload.single("categoryImage")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const { categoryName } = req.body;
    const updateData = {};
    if (categoryName) updateData.categoryName = categoryName;
    if (req.file) updateData.categoryImage = req.file.path;

    try {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// DELETE a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
