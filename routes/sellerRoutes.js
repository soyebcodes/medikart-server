const express = require('express');
const router = express.Router();
const { getSellerRevenue } = require('../controllers/sellerController');

router.get('/:id/revenue', getSellerRevenue);

module.exports = router;
