const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  sellerEmail: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = Advertisement;
