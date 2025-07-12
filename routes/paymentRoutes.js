const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

// GET all payments (optionally filtered by status)
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const payments = await Payment.find(filter).sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Get all payments made by a specific user (buyer)
router.get("/user/:email", async (req, res) => {
  const buyerEmail = req.params.email;

  try {
    const payments = await Payment.find({ buyerEmail });
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
});

// get payments specific to a user
router.get("/seller/:email", async (req, res) => {
  const sellerEmail = req.params.email;

  try {
    const payments = await Payment.find({ sellerEmail });
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
});


// PATCH /api/payments/:id → update payment status to "paid"
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "paid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
