// Require modules
const express = require('express');
const AuthenticationControllerPolicy = require('../../policies/AuthenticationControllerPolicy')

// Get router
const router = express.Router()
const AuthenticationController = require('../../controllers/AuthenticationController')

// Login user
router.post('/', AuthenticationControllerPolicy.login, AuthenticationController.login);

module.exports = router;