// Require modules
const express = require('express');
const JwtHelper = require('../jwt')

// Get router
const router = express.Router()
const EpisodesController = require('../../controllers/EpisodesController')
const EpisodesControllerPolicy = require('../../policies/EpisodesControllerPolicy')

// Add JWT Middleware
// router.use(JwtHelper.authenticateToken)

// Read episodes
router.get('/:serie', EpisodesControllerPolicy.get, EpisodesController.get)

// Upload video (video YT, Video Locale & Thumbnail + DB record)
router.post('/:serie/youtube', JwtHelper.authenticateToken, EpisodesControllerPolicy.addYoutube, EpisodesController.addYoutube)
router.post('/:serie/local', JwtHelper.authenticateToken, EpisodesControllerPolicy.addLocal, EpisodesController.addLocal)
router.post('/:serie/upload', JwtHelper.authenticateToken, EpisodesController.upload)
router.post('/:serie/thumbnail', JwtHelper.authenticateToken, EpisodesController.uploadThumbnail)

// Undo upload (video + banner)
router.delete('/:serie/upload', JwtHelper.authenticateToken, EpisodesController.undoUpload)
router.delete('/:serie/thumbnail', JwtHelper.authenticateToken, EpisodesController.undoUploadThumbnail)

// Delete episode
router.delete('/:serie/:episode', JwtHelper.authenticateToken, EpisodesController.deleteEpisode)

// Export router
module.exports = router;