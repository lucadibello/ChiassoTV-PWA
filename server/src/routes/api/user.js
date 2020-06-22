// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const UserController = require('../../controllers/UserController')
const UserControllerPolicy = require('../../policies/UserControllerPolicy')

// Add JWT Middleware
router.use(JwtHelper.authenticateToken)

// Create user
router.get('/', UserController.get)
router.post('/', UserControllerPolicy.create, UserController.create);
router.delete('/:username', UserController.delete)
router.put('/:username', UserControllerPolicy.edit, UserController.edit)

module.exports = router;