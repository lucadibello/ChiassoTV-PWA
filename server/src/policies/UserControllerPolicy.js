const Joi = require('@hapi/joi')

module.exports = {
    create (req, res, next) {
        const _info_regex = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

        // Create validation schema
        const schema = Joi.object({
            username: Joi.string().min(3).max(255)
                .pattern(new RegExp('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'))
                .required(),

            password: Joi.string().alphanum().required(),
            name: Joi.string().min(3).max(255).pattern(_info_regex).required(),
            surname: Joi.string().min(3).max(255).pattern(_info_regex).required(),
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
    },
    edit (req, res, next) {
        const _info_regex = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

        // Create validation schema
        const schema = Joi.object({
            username: Joi.string().min(3).max(255)
                .pattern(new RegExp('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'))
                .required(),

            name: Joi.string().min(3).max(255).pattern(_info_regex).required(),
            surname: Joi.string().min(3).max(255).pattern(_info_regex).required(),
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