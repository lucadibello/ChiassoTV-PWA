const { Episode } = require('../models');

function encodeTitle (title) {
    return title.replace(/\s+/g, '-').toLowerCase()
}

module.exports = {
    get (req, res) {
        Episode.findAll({
            order: [
                ['createdAt', 'ASC'],
            ]
        }).then((episodes) => {
            res.send(episodes)
        })
    },
    addYoutube (req, res) {
        // Save data to DB (isFromYoutube flag set to 'true')
        Episode.create({
            title: req.body.title,
            encoded: encodeTitle(req.body.title),
            serie: req.params.serie,
            link: req.body.link,
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
    addLocal (req, res) {
        res.send('Work in progress')
    }
}