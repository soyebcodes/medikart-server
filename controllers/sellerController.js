const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Advertisement = require('../models/Advertisement');

const getSellerRevenue = async (req, res) => {
  try {
    const sellerId = req.params.id;

    const revenue = await Payment.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: "$status",
          total: { $sum: "$amount" }
        }
      }
    ]);

    const result = {
      paidTotal: 0,
      pendingTotal: 0
    };

    revenue.forEach(entry => {
      if (entry._id === "paid") result.paidTotal = entry.total;
      if (entry._id === "pending") result.pendingTotal = entry.total;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue", error });
  }
};



const getSellerPayments = async (req, res) => {
  try {
   const sellerEmail = req.params.email;

    const payments = await Payment.find({ sellerEmail })
      .populate('medicineId', 'itemName')
      .populate('buyerId', 'name email');

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments", error: err.message });
  }
};




const createAdvertisement = async (req, res) => {
  const { description } = req.body;
  const sellerEmail = req.params.email;

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const ad = new Advertisement({
      sellerEmail,
      imageUrl: req.file.path, // Cloudinary URL from multer
      description,
    });

    const saved = await ad.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create advertisement", error: error.message });
  }
};

const getSellerAdvertisements = async (req, res) => {
  const sellerEmail = req.params.email;

  try {
    const ads = await Advertisement.find({ sellerEmail }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch advertisements", error: error.message });
  }
};



module.exports = { getSellerRevenue, getSellerPayments, getSellerAdvertisements, createAdvertisement };