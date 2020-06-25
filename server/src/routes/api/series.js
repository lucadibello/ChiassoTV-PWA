// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const SeriesController = require('../../controllers/SeriesController')
const SeriesControllerPolicy = require('../../policies/SeriesControllerPolicy')

// Add JWT Middleware
// router.use(JwtHelper.authenticateToken)

// Create user
router.get('/', SeriesController.get)
router.post('/', SeriesControllerPolicy.create, SeriesController.create)
router.delete('/:name', SeriesController.delete)
router.put('/:name', SeriesControllerPolicy.edit, SeriesController.edit)

module.exports = router;