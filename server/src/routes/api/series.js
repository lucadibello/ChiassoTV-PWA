// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const SeriesController = require('../../controllers/SeriesController')
const SeriesControllerPolicy = require('../../policies/SeriesControllerPolicy')

// Add JWT Middleware
// router.use(JwtHelper.authenticateToken)

// No JWT needed
router.get('/', SeriesController.get)
router.get('/:name', SeriesController.getSerie)

// JWT Needed
router.post('/', JwtHelper.authenticateToken, SeriesControllerPolicy.create, SeriesController.create)
router.delete('/:name', JwtHelper.authenticateToken, SeriesController.delete)
router.put('/:name', JwtHelper.authenticateToken, SeriesControllerPolicy.edit, SeriesController.edit)

module.exports = router;