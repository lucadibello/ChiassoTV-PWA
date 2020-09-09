const multer = require('multer')
const config = require('../config/config')
const fs = require('fs')

function encodeFilename (name) {
    // Get only letters
    let sanitized = name.replace(/[^a-zA-Z ]+/g, '');
    // Replace spaces with dash
    return sanitized.replace(/\s+/g, '-').toLowerCase()
}

const storage = multer.diskStorage(
    {
        destination: config.assets.series,
        filename: function ( req, file, cb ) {
            // Set filename
            cb( null, encodeFilename(file.originalname));
        }
    }
);

// Create multer object (will handle the upload)
const upload_file = multer({
    limits: {fileSize: 1000000, files:1},
    storage: storage
}).single('banner')

module.exports = {
    upload (req, res) {
        upload_file (req, res, function (err) {
            if (err instanceof multer.MulterError || err) {
                // A Multer error occurred when uploading.
                res.status(400).send({
                    message: err.message
                })
            }
            
            // Send success response (message + file infos)
            res.send({
                message: 'Image uploaded successfully on the server',
                file: req.file
            })
        })
    },
    get (req, res) {
        // Read all banners available
        let files = fs.readdirSync(config.assets.series);

        // Send banner list
        res.send({banners: files})
    }
}