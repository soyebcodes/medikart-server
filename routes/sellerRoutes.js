const express = require('express');
const router = express.Router();
const { getSellerRevenue } = require('../controllers/sellerController');
const { getSellerPayments } = require('../controllers/sellerController');

router.get('/:id/revenue', getSellerRevenue);

router.get('email/:email/payments', getSellerPayments);


module.exports = router;
