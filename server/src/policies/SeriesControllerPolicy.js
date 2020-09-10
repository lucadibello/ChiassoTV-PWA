const Joi = require('@hapi/joi')
const config = require('../config/config')
const fs = require('fs')
const path = require('path')

module.exports = {
    create (req, res, next) {
        // Create validation schema
        const schema = Joi.object({
            name: Joi.string().min(3).max(125).required(),
            file: Joi.string().required(),
            description: Joi.string()
        });

        // Validate data
        console.log(req.body)
        let result = schema.validate(req.body);

        if(result.error){
            res.status(400).send({
                error: result.error.message
            });
        }
        else{
            // Check if file exists using path
            if (!fs.existsSync(path.resolve(config.assets.series, req.body.file))) {
                res.status(400).send({
                    error: 'The banner image does not exists on the server. First you have to upload the image.'
                })
            }
            else{
                // pass to next handler
                next()
            }
        }
    },
    edit (req, res, next) {
        // Validate using scheme
        const schema = Joi.object({
            name: Joi.string().min(3).max(125).required(),
            banner: Joi.string().required(),
            description: Joi.string()
        });

        // Validate data
        let result = schema.validate(req.body);

        if(result.error){
            res.status(400).send({
                error: result.error.message
            });
        }
        else{
            // Re-Format name
            req.body.name = req.body.name.replace(/\s+/g, '-').toLowerCase()
            
            // Check if file exists using path
            if (!fs.existsSync(path.resolve(config.assets.series, req.body.banner))) {
                res.status(400).send({
                    error: 'The banner image does not exists on the server. First you have to upload the image.'
                })
            }
            else{
                // pass to next handler
                next()
            }
        }
    }
}