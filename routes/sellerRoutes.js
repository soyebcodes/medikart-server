const express = require('express');
const router = express.Router();
const { getSellerRevenue } = require('../controllers/sellerController');
const { getSellerPayments } = require('../controllers/sellerController');
const {
  getSellerAdvertisements,
  createAdvertisement
} = require('../controllers/sellerController');

router.get('/:id/revenue', getSellerRevenue);

router.get('email/:email/payments', getSellerPayments);

// Get all ads for a seller
router.get('/:id/advertisements', getSellerAdvertisements);

// Create a new ad
router.post('/:id/advertisements', createAdvertisement);


module.exports = router;
