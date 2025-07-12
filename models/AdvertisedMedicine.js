const mongoose = require("mongoose");

const advertisedMedicineSchema = new mongoose.Schema({
  sellerEmail: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true }, // from Cloudinary/Multer
  isInSlider: { type: Boolean, default: false }, // controlled by admin
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Advertisement", advertisedMedicineSchema);
