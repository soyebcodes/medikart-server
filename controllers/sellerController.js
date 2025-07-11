const mongoose = require('mongoose');
const Payment = require('../models/Payment');

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
    const sellerId = req.params.id;

    const payments = await Payment.find({ sellerId })
      .populate('medicineId', 'itemName')
      .populate('buyerId', 'name email');

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments", error: err.message });
  }
};


module.exports = { getSellerRevenue, getSellerPayments };