const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");

// GET all sales or filtered by date range
router.get("/", async (req, res) => {
  try {
    const { start, end } = req.query;

    let query = {};
    if (start && end) {
      query.date = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const sales = await Sale.find(query).sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
