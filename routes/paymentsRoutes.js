const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const router = express.Router();
const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const DEFAULT_CURRENCY = "usd";

// Middleware placeholder: add auth & role checks here
// e.g. router.use(authMiddleware);

/**
 * GET /api/payments
 * Get all payments, optionally filtered by status (pending/paid)
 * Query param: status (optional)
 */
router.get(
  "/",
  query("status").optional().isIn(["pending", "paid"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { status } = req.query;
      const filter = status ? { status } : {};
      const payments = await Payment.find(filter).sort({ date: -1 }).lean();
      res.json({ success: true, data: payments });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * GET /api/payments/user/:email
 * Get payments by buyer email
 */
router.get(
  "/user/:email",
  param("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const payments = await Payment.find({ buyerEmail: req.params.email })
        .sort({ date: -1 })
        .lean();
      res.json({ success: true, data: payments });
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * GET /api/payments/seller/:email
 * Get payments by seller email
 */
router.get(
  "/seller/:email",
  param("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const payments = await Payment.find({ sellerEmail: req.params.email })
        .sort({ date: -1 })
        .lean();
      res.json({ success: true, data: payments });
    } catch (error) {
      console.error("Error fetching seller payments:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * GET /api/payments/pending/all
 * Get all pending payments (admin)
 */
router.get("/pending/all", async (req, res) => {
  try {
    const pendingPayments = await Payment.find({ status: "pending" })
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, data: pendingPayments });
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/payments/create-payment-intent
 * Create Stripe payment intent
 * Body: { amount: number (in dollars) }
 */
router.post(
  "/create-payment-intent",
  body("amount").isFloat({ gt: 0 }),
  body("email").optional().isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { amount, email } = req.body;
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: DEFAULT_CURRENCY,
        payment_method_types: ["card"],
        receipt_email: email || undefined, // pass email if provided
      });

      res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error("Stripe create-payment-intent error:", err);
      res.status(500).json({ success: false, message: "Stripe error", error: err.message });
    }
  }
);


/**
 * POST /api/payments/record-payment
 * Record multiple payments in DB, initial status pending
 * Body: { payments: array }
 */



router.post(
  "/record-payment",
  body("payments").isArray({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { payments } = req.body;
      // Optionally sanitize payments here (add createdAt, status etc.)
      payments.forEach(p => {
        if (!p.status) p.status = "pending";
        if (!p.date) p.date = new Date();
      });

      const saved = await Payment.insertMany(payments);
      res.status(201).json({ success: true, message: "Payments recorded", data: saved });
    } catch (error) {
      console.error("Error saving payments:", error);
      res.status(500).json({ success: false, message: "Failed to record payments", error: error.message });
    }
  }
);

router.get("/pending-payment", async (req, res) => {
  try {
    const pendingPayments = await Payment.find({ status: "pending" });
    res.json({ success: true, data: pendingPayments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending payments", error: err.message });
  }
});


/**
 * PATCH /api/payments/:id
 * Update payment status (pending/paid)
 * Body: { status: string }
 */
router.patch(
  "/:id",
  param("id").isMongoId(),
  body("status").isIn(["pending", "paid"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
      res.json({ success: true, data: payment });
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * PATCH /api/payments/:id/approve
 * Approve payment (mark status as paid)
 */
router.patch(
  "/:id/approve",
  param("id").isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const updated = await Payment.findByIdAndUpdate(
        req.params.id,
        { status: "paid" },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: "Payment not found" });
      res.json({ success: true, message: "Payment approved", data: updated });
    } catch (err) {
      console.error("Error approving payment:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
