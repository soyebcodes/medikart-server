const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middlewares/upload"); // Your configured multer instance
const { verifyJWT } = require("../middlewares/verifyJWT");
const { verifySeller } = require("../middlewares/verifySeller");
const { verifyAdmin } = require("../middlewares/verifyAdmin");
const Medicine = require("../models/Medicine");

// GET all medicines (public)
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET medicine by ID
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET medicines by seller email
router.get("/seller/:email", verifyJWT, verifySeller, async (req, res) => {
  try {
    const email = req.params.email;
    const medicines = await Medicine.find({ sellerEmail: email });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST new medicine (Seller Only)
// POST new medicine (Seller Only)
router.post(
  "/",
  verifyJWT,
  verifySeller,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const {
        name,
        genericName,
        shortDescription,
        category,
        company,
        unit,
        pricePerUnit,
        discountPercentage,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const newMedicine = new Medicine({
        name,
        genericName,
        shortDescription,
        category,
        company,
        unit: unit.toUpperCase(),
        pricePerUnit: parseFloat(pricePerUnit),
        discountPercentage: parseFloat(discountPercentage || 0),
        image: req.file.path, // Cloudinary URL
        sellerEmail: req.user.email,
      });

      const saved = await newMedicine.save();
      res.status(201).json(saved);
    } catch (error) {
      res.status(500).json({ message: "Failed to add medicine", error: error.message });
    }
  }
);

// PATCH update medicine (Seller only)
router.patch(
  "/:id",
  verifyJWT,
  verifySeller,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.image = req.file.path; 
      }

      const updated = await Medicine.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!updated) return res.status(404).json({ message: "Medicine not found" });

      res.json({ message: "Medicine updated", updated });
    } catch (error) {
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  }
);

// DELETE medicine (Seller only)
router.delete("/:id", verifyJWT, verifySeller, async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// GET discounted
router.get("/discounts/all", async (req, res) => {
  try {
    const discounted = await Medicine.find({ discountPercentage: { $gt: 0 } });
    res.json(discounted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET advertised
router.get("/advertised/all", async (req, res) => {
  try {
    const ads = await Medicine.find({ isAdvertised: true });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET by category
router.get("/category/:category", async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Toggle advertise (Admin only)
router.patch("/:id/toggle-advertise", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    medicine.isAdvertised = !medicine.isAdvertised;
    await medicine.save();

    res.json({ message: "Advertisement status toggled", isAdvertised: medicine.isAdvertised });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle", error: error.message });
  }
});

module.exports = router;
