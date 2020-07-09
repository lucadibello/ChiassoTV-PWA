// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const EpisodesController = require('../../controllers/EpisodesController')
const EpisodesControllerPolicy = require('../../policies/EpisodesControllerPolicy')

// TODO: ENABLE JWT TOKENS 


// Add JWT Middleware
// router.use(JwtHelper.authenticateToken)

// Create user
router.get('/:serie', EpisodesControllerPolicy.get, EpisodesController.get)
router.post('/:serie/youtube', EpisodesControllerPolicy.addYoutube, EpisodesController.addYoutube)
router.post('/:serie/local', EpisodesController.addLocal, EpisodesController.addLocal)

module.exports = router;