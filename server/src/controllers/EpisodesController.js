const { Episode, sequelize } = require('../models')
const config = require('../config/config')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const request = require('request')

function encodeTitle (title) {
    // Get only letters
    let sanitized = title.replace(/[^a-zA-Z1-9 ]+/g, '');
    // Replace spaces with dash
    return sanitized.replace(/\s+/g, '-').toLowerCase()
}

function getFileExtension (filename) {
    // Read file extension
    let parts = filename.split('.')
    return parts[parts.length-1]
}

async function generateNewVideoPosition () {
    let order_index = await Episode.max('order_index').then(index => {
        return Math.max(index) + 1
    })
    return order_index;
}
 
rmDir = function(dirPath, removeSelf) {
    if (removeSelf === undefined)
      removeSelf = true;
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    if (removeSelf)
      fs.rmdirSync(dirPath);
};

function saveTempFile(tempDir, filename, req) {
    // Read files located inside the tmp folder
    let videos = fs.readdirSync(path.resolve(config.assets.episodes, '_tmp', tempDir))
    let new_filename = null

    // Cycle all files inside series's episodes directory
    videos.forEach((file) => {
        // Check every filename
        if (file === filename) {
            // Move file to correct directory + set flag
            
            // Get current and new path
            const currentPath = path.resolve(config.assets.episodes, '_tmp', tempDir, file)

            // Final path: EPISODE DIR/<serie>/base64(title)

            // Generate new filename (filename to base64 + extension)
            new_filename =  Buffer.from(file).toString('base64') + '.' + getFileExtension(file)
            // Move to right directory
            const finalDirectory = path.resolve(config.assets.episodes, req.params.serie, Buffer.from(encodeTitle(req.body.title)).toString('base64'))
            const newPath = path.resolve(finalDirectory, new_filename)

            // Move video from _tmp to :serie directory
            try {
                console.log(currentPath, newPath)

                // Check if directory exists
                if (!fs.existsSync(finalDirectory)){
                    // Create directory if does not exists
                    fs.mkdirSync(finalDirectory, { recursive: true });
                }

                // Try to rename file
                fs.renameSync(currentPath, newPath)
            } catch (err) {
                console.log('ERROR ->>>>>>', err)
                //res.status(400).send({error: err})
            }
        }
    })

    return new_filename
}

function youtubeParser (url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

// Generate temporary storage (episodes + thumbnails)
const tempVideoStorage = multer.diskStorage(
    {
        destination: config.assets.episodes + '/_tmp/episode',
        filename: function (req, file, cb ) {
            // Set filename
            cb( null, file.originalname );
        }
    }
);

// Generate temporary storage (episodes + thumbnails)
const tempThumbnailStorage = multer.diskStorage(
    {
        destination: config.assets.episodes + '/_tmp/thumbnail',
        filename: function (req, file, cb ) {
            // Set filename
            cb( null, file.originalname );
        }
    }
);

// Multer objects
const uploadVideo = multer({
    limits: { files: 1},
    storage: tempVideoStorage
}).single('video')

const uploadThumbnail = multer({
    limits: { files: 1},
    storage: tempThumbnailStorage
}).single('thumbnail')


module.exports = {
    get (req, res) {
        Episode.findAll({
            order: [
                ['order_index', 'DESC'],
            ],
            where: {
                serie: req.params.serie
            }
        }).then((episodes) => {
            res.send(episodes)
        })
    },
    getEpisode (req, res) {
        Episode.findOne({
            where: {
                encoded: req.params.episode,
                serie: req.params.serie
            }
        }).then((episodes) => {
            res.send(episodes)
        })
    },
    getThumbnail (req, res) {
        // Get thumbnail filename
        Episode.findOne({
            where: {
                serie: req.params.serie,
                encoded: req.params.episode
            }
        }).then((episode) => {
            if (episode) {

                if (episode.isFromYoutube) {
                    // Send YouTube thumbnai

                    // FIXME: [Error: getaddrinfo ENOTFOUND img.youtube.com] when no internet / img.youtube.com is offlinew
                    // Possible fix: Client uses a default image
                    request.get(`https://img.youtube.com/vi/${youtubeParser(episode.link)}/mqdefault.jpg`).pipe(res)
                } else {
                    // Send local file
                    const filename = episode.thumbnail
                    res.sendFile(
                        path.resolve(
                            config.assets.episodes,
                            req.params.serie,
                            Buffer.from(req.params.episode).toString('base64'),
                            filename
                    ))
                }
            } else {
                res.status(404).send('Cannot find the episode thumbnail')
            }
        })
    },
    deleteEpisode (req, res) {

        // Check if episode is from youtube
        Episode.findOne({
            where: {
                encoded: req.params.episode
            }
        }).then(episode => {
            // Check if from youtube
            if (!episode.isFromYoutube) {
                // If local: delete local files
                let dirs = fs.readdirSync(path.resolve(config.assets.episodes, req.params.serie))

                // Cycle every directory
                const b64EpisodeName = Buffer.from(req.params.episode).toString('base64')

                dirs.forEach((episodeDir) => {
                    if (episodeDir === b64EpisodeName) {
                        // Remove all files inside directory
                        rmDir(path.resolve(config.assets.episodes, req.params.serie, b64EpisodeName), true)
                    }
                })
            }

            // Remove DB record
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
        }).catch(err => {
            // Send back MySQL error message
            res.status(400).send({error: err})
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
            // Log error in console
            console.warn(err)
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
        let videoFilename = req.body.video
        let thumbnailFilename = req.body.thumbnail

        // Save temporary video + thumbnail files
        videoFilename = saveTempFile('episode', videoFilename, req)
        thumbnailFilename = saveTempFile('thumbnail', thumbnailFilename, req)

        // Generate new video order index
        let videoOrderIndex = await generateNewVideoPosition();

        // Save data to DB (isFromYoutube flag set to 'false')
        Episode.create({
            title: req.body.title,
            serie: req.params.serie,
            encoded: encodeTitle(req.body.title),
            link: videoFilename,
            thumbnail: thumbnailFilename,
            description: req.body.description || null,
            isFromYoutube: false,
            order_index: videoOrderIndex
        }).then(function (episode) {
            // Check response
            if (episode) {
                res.send({message: 'Local video added successfully'})
            } else {
                res.status(400).send({error: 'Error occurred during the insert process'});
            }
        }).catch((err) => {
            console.log(err)

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

        try {
            // Cycle all files inside episode temp directory
            const files = fs.readdirSync(path.resolve(config.assets.episodes, '_tmp', 'episode'))

            // Cycle throght all files present in the directory
            files.forEach((file) => {
                // Find file
                if (file === filename) {
                    // Delete file
                    fs.unlinkSync(path.resolve(config.assets.episodes, '_tmp', 'episode', filename))
                }
            })

            res.send({message: 'Video deleted successfully'})
        } catch (err) {
            res.status(400).send({error: err})
        }
    },
    uploadThumbnail (req, res) {
        // Thumbnail filename: .thumbnail.<extension>

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
        // Delete thumbnail
        const filename = JSON.parse(req.body).file.filename

        try {
            // Cycle all files inside episode temp directory
            const files = fs.readdirSync(path.resolve(config.assets.episodes, '_tmp', 'thumbnail'))

            // Cycle throght all files present in the directory
            files.forEach((file) => {
                // Find file
                if (file === filename) {
                    // Delete file
                    fs.unlinkSync(path.resolve(config.assets.episodes, '_tmp', 'thumbnail', filename))
                }
            })

            res.send({message: 'Video deleted successfully'})
        } catch (err) {
            res.status(400).send({error: err})
        }
    },
    sendVideo (req, res) {
        // Get video filename
        Episode.findOne({
            where: {
                serie: req.params.serie,
                encoded: req.params.episode
            }
        }).then((episode) => {
            if (episode) {
                if (episode.isFromYoutube) {
                    // Send error
                    res.status(400).send({error: `The video is NOT saved locally, currently the video is on YouTube (${episode.link})`})
                } else {
                    // FIXME: Send HLS playlist file ()
                    
                    // TODO: Finish send video
                    // Path: assets/episodes/:series_name/:b64 episode name/ :b64 filename
                    const b64EpisodeName = Buffer.from(req.params.episode).toString('base64')
                    res.sendFile(path.resolve(config.assets.episodes, req.params.serie, b64EpisodeName, episode.link))
                }
            } else {
                res.status(404).send({error:'Cannot find the episode video'})
            }
        })
    },
    async swapVideoOrder (req, res) {
        // Get current video order index
        let currentEpisode = await Episode.findOne({ where: { encoded: req.body.currentVideo }, attributes: ['order_index'] })
        
        let isMovingUp = req.body.direction == 'UP';

        // Check if the index is valid
        let isIndexValid = false;
        if (isMovingUp) {
            isIndexValid = currentEpisode.get().order_index > 0;
        } else {
            isIndexValid = currentEpisode.get().order_index < await generateNewVideoPosition();
        }

        // Check if episode index is valid (not at the bottom, not at the very top depending on the direction selected)
        if (isIndexValid) {
            let swapEpisode = await Episode.findOne({ where: { encoded: req.body.swapVideo }, attributes: ['order_index'] })
            
            // start transaction
            let swapTransaction = await sequelize.transaction();

            // Swap the two order_indexes
            try {
                // update currentVideo order_index (push down)
                await Episode.update(
                    { 
                        order_index: swapEpisode.get().order_index,
                    },
                    { where: { encoded: req.body.currentVideo }
                }, { transaction: swapTransaction })

                // update swapVideo order_index (push up)
                await Episode.update(
                    { 
                        order_index: currentEpisode.get().order_index,
                    },
                    { where: { encoded: req.body.swapVideo }
                }, { transaction: swapTransaction })
                
                // Commit changes
                await swapTransaction.commit();
            } catch (error) {
                // Error found: rollback!
                transaction.rollback();
                // send back a generic error message
                res.status(400).send({message: "There was an error during the swap process.. try again later"})
            }

            // Send back response
            res.send({message: "Episodes swapped successfully"})
        } else {

            if (isMovingUp) {
                res.status(400).send({error:"The episode is already at the top of the list"})
            } else {
                res.status(400).send({error:"The episode is already at the bottom of the list"})
            }
        }
    },
    moveVideoUp (req, res) {
        // Send back response
        res.send("Work in progress...")
    }
}