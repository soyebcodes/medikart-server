const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Middleware for auth
const verifyJWT = require('../middlewares/verifyJWT');


// CREATE a new medicine (Seller only)
router.post('/', verifyJWT, verifySeller, async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).send({ message: 'Medicine added successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
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


// GET all medicines of a specific seller
router.get('/seller/:email', verifyJWT, verifySeller, async (req, res) => {
  try {
    const email = req.params.email;
    const medicines = await Medicine.find({ sellerEmail: email });
    res.send(medicines);
  } catch (error) {
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

module.exports = router;
