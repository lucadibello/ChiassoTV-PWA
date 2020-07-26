const Joi = require('@hapi/joi')
const config = require('../config/config')

// Load series controller
const {Serie, Episode} = require('../models')

async function seriesExists (seriesName) {
    // Wait validation
    return await Serie.findAll({attributes: ['encoded']}).then((series) => {

        const names = []

        // Extract data
        series.forEach(serie => {
            names.push(serie.encoded.toLowerCase())
        })
        
        // Set callback variable
        return names.includes(seriesName)
    })
}

async function episodeExists (episodeName) {
    // Wait validation
    return await Episode.findAll({attributes: ['encoded']}).then((episodes) => {

        const names = []

        // Extract data
        episodes.forEach(serie => {
            names.push(serie.encoded.toLowerCase())
        })
        
        // Set callback variable
        return names.includes(episodeName)
    })
}

module.exports = {
    get (req, res, next) {
        // Check if the specified series exists
        seriesExists(req.params.serie.toLowerCase()).then((status) => {
            if (status) {
                // Series exists
                next()
            } else {
                // Cannot find series
                res.status(400).send({
                    error: `'${req.params.serie}' is not a valid serie`
                })
            }
        })
    },
    getEpisode (req, res, next) {
        // Check if the specified series exists
        seriesExists(req.params.serie.toLowerCase()).then((seriesStatus) => {
            if (seriesStatus) {
                // Series exists
                // Check if episode exists

                episodeExists(req.params.episode.toLowerCase()).then((episodeStatus) => {
                    if (episodeStatus) {
                        // Episode exists, validation completed
                        next()
                    } else {
                        // Cannot find episode
                        res.status(400).send({
                            error: `The episode ${req.params.episode} does not exist in the specified series (${req.params.serie})`
                        })
                    }
                })
            } else {
                // Cannot find series
                res.status(400).send({
                    error: `'${req.params.serie}' is not a valid serie`
                })
            }
        })
    },
    addYoutube (req, res, next) {
        // Validate serie
        const scheme = Joi.object({
            'title': Joi.string().min(3).max(125).required(),
            'link': Joi.string().uri()
                .pattern(new RegExp('^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+')).required(),
            'description': Joi.string()
        })

        // Validate POST request body
        const result = scheme.validate(req.body)
        
        // Check the validation status
        if(result.error){
            // Found errors
            res.status(400).send({
                error: result.error.message
            });
        }
        else {
            // Validate series name
            seriesExists(req.params.serie.toLowerCase()).then((status) => {
                if (status) {
                    // All valid
                    next()
                }
                else {
                    // Cannot find series
                    res.status(400).send({
                        error: `'${req.params.serie}' is not a valid serie`
                    })
                }
            })
        }
    },
    addLocal (req, res, next) {
        /*
        const scheme = Joi.object({
            'title': Joi.string().required(),
            'link': Joi.string().uri().required(),
            'description': Joi.string(4),
            'banner': Joi.string().required()
        })*/
        next()
    },
    upload (req, res, next) {
        const scheme = Joi.object({
            'video': Joi.binary().required(),
        })

        // Validate POST request body
        const result = scheme.validate(req.body)
        
        // Check the validation status
        if(result.error){
            // Found errors
            res.status(400).send({
                error: result.error.message
            });
        }
        else {
            // Validation done
            next()
        }
    }
}