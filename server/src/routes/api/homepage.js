// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const HomepageController = require('../../controllers/HomepageController')
const HomepageControllerPolicy = require('../../policies/HomepageControllerPolicy')

// Add JWT Middleware
router.use(JwtHelper.authenticateToken)

// Add episode to showcase
router.post('/:serie/:episode', HomepageControllerPolicy.generic, HomepageController.add);

// Remove episode from showcase
router.delete('/:serie/:episode', HomepageControllerPolicy.generic, HomepageController.delete);

// Get episode in showcase
router.get('/', HomepageController.get)

module.exports = router;