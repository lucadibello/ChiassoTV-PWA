const { Episode } = require('../models')
const config = require('../config/config')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

function encodeTitle (title) {
    return title.replace(/\s+/g, '-').toLowerCase()
}

// Generate temporary storage 
const storage = multer.diskStorage(
    {
        destination: config.assets.episodes + '/_tmp',
        filename: function (req, file, cb ) {
            // Set filename
            cb( null, file.originalname );
        }
    }
);

// Create multer object (will handle the upload)
const uploadVideo = multer({
    limits: {fileSize: 1000000, files: 1},
    storage: storage
}).single('video')

const uploadThumbnail = multer({
    limits: {fileSize: 1000000, files: 1},
    storage: storage
}).single('thumbnail')


module.exports = {
    get (req, res) {
        Episode.findAll({
            order: [
                ['createdAt', 'ASC'],
            ],
            where: {
                serie: req.params.serie
            }
        }).then((episodes) => {
            res.send(episodes)
        })
    },
    deleteEpisode (req, res) {
        Episode.destroy({
            where: {
                serie: req.params.serie,
                encoded: req.params.episode
            }
        }).then((result) => {
            if(result){
                res.send({
                    message: "Episode deleted successfully"
                })
            }
            else{
                res.status(400).send({
                    error: `The specified episode does not exists in the specified series ('${req.params.serie}')`
                })
            }
        })
    },
    addYoutube (req, res) {
        // Save data to DB (isFromYoutube flag set to 'true')
        Episode.create({
            title: req.body.title,
            serie: req.params.serie,
            encoded: encodeTitle(req.body.title),
            link: req.body.link,
            thumbnail: null,
            description: req.body.description || null,
            isFromYoutube: true
        }).then(function (episode) {
            if (episode) {
                res.send({message: 'YouTube video added successfully'})
            } else {
                res.status(400).send({error: 'Error occurred during the insert process'});
            }
        }).catch((err) => {
            // Check exception type
            if (err.original.code === 'ER_DUP_ENTRY') {
                // Duplicate entry found
                res.status(400).send({error: 'This title is already in use, please choose another title'})
            }
            else {
                res.status(400).send({error: err.message})
            }
        })
    },
    async addLocal (req, res) {
        // Read file name from req.body dictionary
        const filename = req.body.filename

        // Status flag
        let fileMoved = false

        // Read files located inside the tmp folder
        let files = fs.readdirSync(path.resolve(config.assets.episodes, '_tmp'))

        // Cycle all files inside series's episodes directory
        files.forEach((file) => {
            // Check every filename
            if (file === filename) {
                // Move file to correct directory + set flag
                fileMoved = true
                                        
                // Get current and new path
                const currentPath = path.resolve(config.assets.episodes, '_tmp', file)
                const finalDirectory = path.resolve(config.assets.episodes, req.params.serie)
                const newPath = path.resolve(finalDirectory, file)

                // Move video from _tmp to :serie directory
                try {
                    console.log(currentPath, newPath)

                    // Check if directory exists
                    if (!fs.existsSync(finalDirectory)){
                        // Create directory if does not exists
                        fs.mkdirSync(finalDirectory);
                    }

                    // Try to rename file
                    fs.renameSync(currentPath, newPath)
                } catch (err) {
                    res.status(400).send({error: err})
                    return;
                }
            }
        })

        // Save data to DB (isFromYoutube flag set to 'false')
        Episode.create({
            title: req.body.title,
            serie: req.params.serie,
            encoded: encodeTitle(req.body.title),
            link: req.body.filename,
            thumbnail: req.body.thumbnail,
            description: req.body.description || null,
            isFromYoutube: false
        }).then(function (episode) {
            // Check response
            if (episode && fileMoved) {
                res.send({message: 'Local video added successfully'})
            } else {
                res.status(400).send({error: 'Error occurred during the insert process'});
            }
        }).catch((err) => {
            // Check exception type
            if (err.original.code === 'ER_DUP_ENTRY') {
                // Duplicate entry found
                res.status(400).send({error: 'This title is already in use, please choose another title'})
            }
            else {
                res.status(400).send({error: err.message})
            }
        })
    },
    upload (req, res) {
        // Save video to the _tmp directory using multer object
        uploadVideo (req, res, function (err) {
            if (err instanceof multer.MulterError || err) {
                // A Multer error occurred when uploading.
                res.status(400).send({
                    message: err.message
                })
            }
            else {
                // Send success response (message + file infos)
                res.send({
                    message: 'YouTube video uploaded successfully on the server',
                    file: req.file
                })
            }
        })
    },
    undoUpload (req, res) {
        // Get file name from request
        const filename = JSON.parse(req.body).file.filename

        // Delete file inside directory
        let deleted = false

        // Cycle all files inside series's episodes directory
        fs.readdir(path.resolve(config.assets.episodes, '_tmp'), (err, files) => {
            // Check errors
            if (err) {
                res.status(400).send(err)
            } else {
                // Cycle throght all files present in the directory
                files.forEach((file) => {
                    // Find file
                    if (file === filename) {
                        // Delete file
                        fs.unlink(path.resolve(config.assets.episodes, '_tmp', filename), (err) => {
                            if (err) {
                                res.status(400).send(err)
                            } else {
                                // Set deleted flag
                                deleted = true
                            }
                        })
                    }
                })
            }
        }).then(() => {
            // Check deleted flag
            if (deleted) {
                res.send({message: 'Video deleted successfully'})
            } else {
                res.status(400).send({error: 'The video cannot be found on the server'})
            }
        })
    },
    uploadThumbnail (req, res) {
        // Thumbnail filename: thumbnail.<extension>

        // Generate temporary storage 
        const thumbnailStorage = multer.diskStorage(
            {
                destination: config.assets.episodes + '/' + req.params.serie,
                filename: function (req, file, cb ) {
                    // Read file extension
                    let parts = file.originalname.split('.')
                    const extension = parts[parts.length-1]
                    // Set filename
                    cb( null, '.thumbnail.' + extension );
                }
            }
        );

        // Create multer object (will handle the upload)
        const uploadThumbnail = multer({
            limits: {fileSize: 1000000, files: 1},
            storage: thumbnailStorage
        }).single('thumbnail')

        // Save video to the _tmp directory using multer object
        uploadThumbnail (req, res, function (err) {
            if (err instanceof multer.MulterError || err) {
                // A Multer error occurred when uploading.
                res.status(400).send({
                    message: err.message
                })
            }
            else {
                // Send success response (message + file infos)
                res.send({
                    message: 'Video thumbnail uploaded successfully on the server',
                    file: req.file
                })
            }
        })
    },
    undoUploadThumbnail (req, res) {
        res.send('WORK IN PROGRESS...')
    }
}