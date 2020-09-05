const Joi = require('@hapi/joi')
const fs = require('fs')
const config = require('../config/config')

module.exports = {
    add (req, res, next) {
        // Remove empty properties
        Object.keys(req.body).forEach((key, index) => {
            if (req.body[key] == '' || req.body[key] == null) {
                delete req.body[key];
            }
        });
        
        // Create validation schema
        const schema = Joi.object({
            client_email: Joi.string().email(),
            client_name: Joi.string().min(3).max(255).required(),
            client_surname: Joi.string().min(3).max(255).required(),
            client_phoneNumber: Joi.string().min(10).max(15)
                .pattern(/^[0-9]+/).required(),
            
            img: Joi.string().required(),
            start_date: Joi.date().raw().required(),
            end_date: Joi.date().raw().required(),

            description: Joi.string(),
            website_link: Joi.string().uri(),
        });


        // Validate schema 
        let result = schema.validate(req.body);

        if(result.error){
            res.status(400).send({
                error: result.error.message
            });
        }
        else{
            // Check if file exists in folder
            let bannerFilename = req.body.img;

            // Read files in directory
            let files = fs.readdirSync(config.assets.ads)
            
            if(files.includes(bannerFilename)) {
                // Validation success: pass to controller
                next()
            } else {
                res.status(400).send({error: 'Unable to locate the ad image on the server, did you upload the image?'})
            }
        }
    }
}