const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // multer middleware
const { verifyJWT } = require("../middlewares/verifyJWT");
const { verifySeller } = require("../middlewares/verifySeller");
const {
  getSellerRevenue,
  getSellerPayments,
  getSellerAdvertisements,
  createAdvertisement,
} = require("../controllers/sellerController");

// Revenue
router.get("/:id/revenue", verifyJWT, verifySeller, getSellerRevenue);

// Payments
router.get("/:id/payments", verifyJWT, verifySeller, getSellerPayments);

// Get Advertisements
router.get("/:email/advertisements", verifyJWT, verifySeller, getSellerAdvertisements);

// ✅ Create Advertisement with Cloudinary
router.post(
  "/:email/advertisements",
  verifyJWT,
  verifySeller,
  (req, res, next) => {
    req.uploadFolder = "advertisements"; // 💡 Set folder dynamically
    next();
  },
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  createAdvertisement
);

module.exports = router;
