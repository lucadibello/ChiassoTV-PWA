// Require modules
const express = require('express');
const episode = require("../../models/Episode");
const JwtHelper = require('../jwt');

// Get router
const router = express.Router()

// Return all episodes
router.get('/', JwtHelper.authenticateToken, (req, res) => {
    episode.findAll().then((data) => {
        res.send(data);
    });
});

// Return specific episode
router.get('/:categoryId/:episodeId', JwtHelper.authenticateToken,(req, res) => {
    episode.findAll({
        where: {
            episode_number: req.params.categoryId,
            category_id: req.params.episodeId
        }
    }).then((data) => {
        res.send(data);
    });
});


module.exports = router;