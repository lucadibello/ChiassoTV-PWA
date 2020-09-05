const config = require('../config/config');
const {Advertisement} = require('../models')
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ads images storage
const adsStorage = multer.diskStorage(
    {
        destination: config.assets.ads,
        filename: function (req, file, cb ) {
            // Set filename
            cb( null, file.originalname );
        }
    }
);

// Create multer object
const uploadBanner = multer({
    limits: { files: 1},
    storage: adsStorage
}).single('banner')

module.exports = {
    get (req, res) {
        Advertisement.findAll().then(ads => {
            if (!ads) {
                // Return error message
                res.status(400).send({
                    error: 'Cannot load ads, database error'
                })
            } else {
                // Send back ads
                res.send(ads)
            }
        })
    },
    add (req, res) {
        // Validation step completed!

        // Save data into DB using Advertisement model
        Advertisement.create({
            client_email: req.body.client_email,
            client_name: req.body.client_name,
            client_surname: req.body.client_surname,
            client_phoneNumber: req.body.client_phoneNumber,
            img: req.body.img,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            description: req.body.description,
            website_link: req.body.website_link
        }).then(ad => {
            if (ad) {
                res.send({message: 'Ad created and published successfully'})
            } else {
                res.status(400).send({error: 'Error occurred during the ad creation process'});
            }
        }).catch((err) => {
            // Return error message
            res.status(400).send({error: err.message})
        })
    },
    upload (req, res) {
        // Upload banner using Multer
        uploadBanner(req, res, function (err) {
            if (err instanceof multer.MulterError || err) {
                // A Multer error occurred when uploading.
                res.status(400).send({
                    message: err.message
                })
            }
            else {
                // Send success response (message + file infos)
                res.send({
                    message: 'Ad banner uploaded successfully on the server',
                    file: req.file
                })
            }
        });
    },
    undoUpload (req, res) {
        // Get file name from request
        const filename = JSON.parse(req.body).file.filename

            // Delete flag (false = not deleted, true = file deleted successfully)
            let wasDeleted = false;

            // Cycle all files inside episode temp directory
            const files = fs.readdirSync(path.resolve(config.assets.ads))
            console.log(files)
            // Cycle throght all files present in the directory
            files.forEach((file) => {
                // Find file
                if (file === filename) {
                    // Delete file
                    fs.unlinkSync(path.resolve(config.assets.ads, filename))
                    
                    // Set wasDeleted flag
                    wasDeleted = true;
                }
            })

            if (wasDeleted) {
                // Send response back
                res.send({message: 'Ad banner deleted successfully'})
            } else {
                res.status(400).send({error: 'Unable to locate the ad banner file'})
            }
        
    }
}