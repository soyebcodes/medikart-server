const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/verifyJWT");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

const { getAllPayments, updatePaymentStatus } = require("../controllers/paymentController");

router.get("/", verifyJWT, verifyAdmin, getAllPayments);
router.patch("/:id/status", verifyJWT, verifyAdmin, updatePaymentStatus);

module.exports = router;
