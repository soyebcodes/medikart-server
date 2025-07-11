const Payment = require("../models/Payment");

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("medicineId", "name")
      .populate("sellerId", "email")
      .populate("buyerId", "email")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "paid";
    await payment.save();

    res.json({ message: "Payment status updated to paid", payment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment", error: error.message });
  }
};

module.exports = { getAllPayments, updatePaymentStatus };
