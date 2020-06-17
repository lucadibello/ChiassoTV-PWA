// Require modules
const express = require('express');
const JwtHelper = require('../jwt')
const UserControllerPolicy = require('../../policies/UserControllerPolicy')

// Get router
const router = express.Router()
const UserController = require('../../controllers/UserController')

// Add JWT Middleware
router.use(JwtHelper.authenticateToken)

// Create user
router.post('/', UserControllerPolicy.create, UserController.create);
router.delete('/:username', UserController.delete)

module.exports = router;