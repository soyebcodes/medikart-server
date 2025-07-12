const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  buyerEmail: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  medicineName: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
