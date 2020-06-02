// Require modules
const express = require('express');

// Get router
const router = express.Router()

// Login user
router.post('/', (req, res) => {
    res.send(req.body);
});

module.exports = router;