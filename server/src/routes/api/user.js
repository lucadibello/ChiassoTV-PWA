// Require modules
const express = require('express');
const UserControllerPolicy = require('../../policies/UserControllerPolicy')

// Get router
const router = express.Router()
const UserController = require('../../controllers/UserController')

// Create user
router.post('/', UserControllerPolicy.create, UserController.create);
router.delete('/:username', UserController.delete)

module.exports = router;