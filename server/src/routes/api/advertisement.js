// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const AdvertisementController = require('../../controllers/AdvertisementController')
const AdvertisementControllerPolicy = require('../../policies/AdvertisementControllerPolicy')

// Get all banners
router.get('/', AdvertisementController.get)

// Get only available ads
router.get('/available', AdvertisementController.getAvailable)
// Get only expired ads
router.get('/expired', AdvertisementController.getExpired)
// Get only inbound ads
router.get('/inbound', AdvertisementController.getInbound)

// Delete Ad
router.delete('/:id', AdvertisementController.delete)

// Create new banner
router.post('/', JwtHelper.authenticateToken, AdvertisementControllerPolicy.add, AdvertisementController.add)

// Upload series banner
router.post('/upload', JwtHelper.authenticateToken, AdvertisementController.upload)
// Revert upload
router.delete('/upload', JwtHelper.authenticateToken, AdvertisementController.undoUpload)
// Fetch banner image
router.get('/:id/banner', AdvertisementController.sendBanner)

module.exports = router;