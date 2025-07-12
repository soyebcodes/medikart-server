const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sale", saleSchema);
