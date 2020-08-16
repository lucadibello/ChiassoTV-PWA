// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const HomepageController = require('../../controllers/HomepageController')
const HomepageControllerPolicy = require('../../policies/HomepageControllerPolicy')

// Add episode to showcase (JWT auth)
router.post('/:serie/:episode', JwtHelper.authenticateToken,  HomepageControllerPolicy.generic, HomepageController.add);

// Remove episode from showcase (JWT auth)
router.delete('/:serie/:episode', JwtHelper.authenticateToken, HomepageControllerPolicy.generic, HomepageController.delete);

// Get episode in showcase (NO AUTH)
router.get('/', HomepageController.get)

module.exports = router;