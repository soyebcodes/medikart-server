const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Middleware for auth
const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdmin } = require('../middlewares/verifyAdmin');
const { verifySeller } = require('../middlewares/verifySeller');

// CREATE a new medicine (Seller only)
// medicineRoutes.js
router.post('/', verifyJWT, verifySeller, async (req, res) => {
  try {
    const sellerEmail = req.user.email;

    const {
      name,
      genericName,
      shortDescription,
      image,
      category,
      company,
      unit,
      pricePerUnit,
      discountPercentage,
    } = req.body;

    const newMedicine = new Medicine({
      name,
      genericName,
      shortDescription,
      image,
      category,
      company,
      unit,
      pricePerUnit: parseFloat(pricePerUnit),
      discountPercentage: parseFloat(discountPercentage || 0),
      sellerEmail,
    });

    const result = await newMedicine.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Error adding medicine:", error); // 🔥 Log the full error
    res.status(500).json({ error: "Failed to add medicine" });
  }
});

// GET all medicines (Public/Shop page)
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.send(medicines);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



// GET all discounted medicines (Homepage section)
router.get('/discounts/all', async (req, res) => {
  try {
    const discounted = await Medicine.find({ discountPercentage: { $gt: 0 } });
    res.send(discounted);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET advertised medicines (for homepage slider)
router.get('/advertised/all', async (req, res) => {
  try {
    const ads = await Medicine.find({ isAdvertised: true });
    res.send(ads);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET all medicines of a specific category (Category Details Page)
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const medicines = await Medicine.find({ category });
    res.send(medicines);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET all medicines of a specific seller (Seller only)
router.get('/seller/:email', verifyJWT, verifySeller, async (req, res) => {
  try {
    const emailParam = req.params.email.toLowerCase(); // Normalize query param

    console.log("Seller email received:", emailParam);

    const medicines = await Medicine.find({ sellerEmail: emailParam });

    console.log(`Medicines found for ${emailParam}:`, medicines.length);

    res.send(medicines);
  } catch (error) {
    console.error("Error fetching seller medicines:", error);
    res.status(500).send({ error: error.message });
  }
});

// PATCH: Update medicine details (Seller only)
router.patch('/:id', verifyJWT, verifySeller, async (req, res) => {
  try {
    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send({ message: 'Medicine updated successfully', updated });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// DELETE: Remove a medicine (Seller only)
router.delete('/:id', verifyJWT, verifySeller, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.send({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PATCH: Toggle advertisement status (Admin only)
router.patch('/:id/toggle-advertise', verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).send({ error: 'Medicine not found' });

    medicine.isAdvertised = !medicine.isAdvertised;
    await medicine.save();
    res.send({ message: `Advertisement status updated to ${medicine.isAdvertised}` });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET medicine by ID (for modal details)
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).send({ error: 'Medicine not found' });
    res.send(medicine);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
