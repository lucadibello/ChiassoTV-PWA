// Require modules
const express = require('express');

// Get router
const router = express.Router()
const UserController = require('../../controllers/UserController')

// Login user
router.post('/', UserController.create);

module.exports = router;