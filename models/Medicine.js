const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genericName: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    enum: ['Mg', 'ML'],
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  sellerEmail: {
    type: String,
    required: true,
  },

  // Advertisement Fields
  adDescription: {
    type: String,
    default: '',
  },
  isAdvertised: {
    type: Boolean,
    default: false,
  },

  // Stock and timestamps (optional but useful)
  inStock: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);
