// Require modules
const express = require('express');

// Get router
const router = express.Router()
const AuthenticationController = require('../../controllers/AuthenticationController')

// Login user
router.post('/', AuthenticationController.login);

module.exports = router;