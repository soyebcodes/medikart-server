const express = require("express");
const router = express.Router();
const Advertisement = require("../models/AdvertisedMedicine");

// Get all advertised medicines
router.get("/", async (req, res) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch advertisements", error: error.message });
  }
});

// Toggle isInSlider field
// PATCH /api/advertised/:id/toggle-slider
router.patch("/:id/toggle", async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });

    ad.isInSlider = !ad.isInSlider;
    await ad.save();

    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle advertisement", error: error.message });
  }
});


module.exports = router;
