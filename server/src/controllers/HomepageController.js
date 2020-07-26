const { Showcase, Episode } = require('../models')

// Set references for JOIN
Showcase.belongsTo(Episode, {targetKey:'encoded',foreignKey: 'episode', as: 'episode_information'});

module.exports = {
    get (req, res) {
        Showcase.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: Episode,
                required: true,
                as: 'episode_information'
            }]
        }).then(episodes => {
            // Send back episodes
            res.send(episodes)
        }).catch(err => {
            console.log(err)
            // Send error back to the client
            res.status(400).send({error: err})
        })
    },
    add (req, res) {
        // Add row to Showcase table
        Showcase.create({
            serie: req.params.serie,
            episode: req.params.episode
        }).then(function (showcaseEpisode) {
            // Check DB response
            if (showcaseEpisode) {
                res.send({message: 'Episode added successfully to showcase'})
            } else {
                res.status(400).send({error: 'Error occurred during the insert process'});
            }
        }).catch(err => {
            if (err.original.code === 'ER_DUP_ENTRY') {
                res.status(400).send({error: "L'episodio è già presente in vetrina"})
            } else {
                res.status(400).send({error: err})
            }
        })
    },
    delete (req, res) {
        // Remove episode from Showcase
        Showcase.destroy({
            where: {
                serie: req.params.serie,
                episode: req.params.episode
            }
        }).then((result) => {
            if(result){
                res.send({
                    message: `Episode '${req.params.episode}' removed successfully from showcase`
                })
            }
            else{
                res.status(400).send({
                    error: 'Error accurred during the removal process'
                })
            }
        })
    }
}