// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const AdvertisementController = require('../../controllers/AdvertisementController')
const AdvertisementControllerPolicy = require('../../policies/AdvertisementControllerPolicy')

// Upload series banner
router.get('/', AdvertisementController.get)
router.post('/', JwtHelper.authenticateToken, AdvertisementControllerPolicy.add, AdvertisementController.add)

router.post('/upload', JwtHelper.authenticateToken, AdvertisementController.upload)
router.delete('/upload', JwtHelper.authenticateToken, AdvertisementController.undoUpload)

module.exports = router;