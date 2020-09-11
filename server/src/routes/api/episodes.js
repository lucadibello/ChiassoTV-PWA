// Require modules
const express = require('express');
const JwtHelper = require('../jwt')
const cors = require(cors)

// Get router
const router = express.Router()
const EpisodesController = require('../../controllers/EpisodesController')
const EpisodesControllerPolicy = require('../../policies/EpisodesControllerPolicy');
const { assets } = require('../../config/config');

// Add JWT Middleware
// router.use(JwtHelper.authenticateToken)

// Read episodes (data, assets)
router.get('/:serie', EpisodesControllerPolicy.get, EpisodesController.get) // All episodes
router.get('/:serie/:episode', EpisodesControllerPolicy.getEpisode, EpisodesController.getEpisode) // Single episode

router.get('/:serie/:episode/thumbnail', EpisodesControllerPolicy.getEpisode, EpisodesController.getThumbnail) // Get episode thumbnail
router.get('/:serie/:episode/episode', EpisodesControllerPolicy.getEpisode, EpisodesController.sendVideo) // Get episode video

// Upload video (video YT, Video Locale & Thumbnail + DB record)
router.post('/:serie/youtube', JwtHelper.authenticateToken, EpisodesControllerPolicy.addYoutube, EpisodesController.addYoutube)
router.post('/:serie/local', cors(), JwtHelper.authenticateToken, EpisodesControllerPolicy.addLocal, EpisodesController.addLocal)
router.post('/:serie/upload', JwtHelper.authenticateToken, EpisodesController.upload)
router.post('/:serie/thumbnail', JwtHelper.authenticateToken, EpisodesController.uploadThumbnail)

// Undo upload (video + banner)
router.delete('/:serie/upload', JwtHelper.authenticateToken, EpisodesController.undoUpload)
router.delete('/:serie/thumbnail', JwtHelper.authenticateToken, EpisodesController.undoUploadThumbnail)

// Delete episode
router.delete('/:serie/:episode', JwtHelper.authenticateToken, EpisodesController.deleteEpisode)

// Move episodes
router.patch('/:serie/move', JwtHelper.authenticateToken, EpisodesController.swapVideoOrder)

// Export router
module.exports = router;