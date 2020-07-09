const Joi = require('@hapi/joi')

module.exports = {
    login (req, res, next) {
        
        // Create validation schema
        const schema = Joi.object({
            username: Joi.string().min(3).max(255)
                .pattern(new RegExp('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'))
                .required(),

            password: Joi.string().required(),
        });

        // Validate data
        let result = schema.validate(req.body);

        if(result.error){
            res.status(400).send({
                error: result.error.message
            });
        }
        else{
            // Validation success: pass to controller
            next()
        }
    }
}