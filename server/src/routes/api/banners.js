// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const BannerController = require('../../controllers/BannerController')

// Add JWT Middleware
router.use(JwtHelper.authenticateToken)

// Upload series banner
router.get('/', BannerController.get)
router.patch('/', BannerController.upload)

module.exports = router;