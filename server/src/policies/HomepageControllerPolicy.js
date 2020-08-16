const Joi = require("@hapi/joi");

// Import DB schemes
const { Serie, Episode } = require('../models')

async function seriesExists (seriesName) {
	// Wait validation
	return await Serie.findOne({
		attributes: ['encoded'],
		where: {
			encoded: seriesName,
		}}).then((serie) => {
			// Return status
			return serie !== null;
	})
}

async function episodeExists (seriesName, episodeName) {
	// Wait validation
	return await Episode.findOne({
		attributes: ['encoded'],
		where: {
			serie: seriesName,
			encoded: episodeName
		}}).then((episode) => {

			return episode !== null;
	})
}

module.exports = {
  generic (req, res, next) {
    // Create validation schema for the request parameters
    const schema = Joi.object({
      serie: Joi.string().required(),
      episode: Joi.string().required(),
    });

    // Validate request params
    let result = schema.validate(req.params);

    if (result.error) {
			// Send error message with HTTP status code 400
      res.status(400).send({
        error: result.error.message,
      });
    } else {
		// Check if series exists
		if (seriesExists(req.params.serie)) {
			if (episodeExists(req.params.serie, req.params.episode)) {
				// All valid: params passed correctly + episode & series exists
				next()
			} else {
				// Specified episode does not exists in the specified series
				res.status(400).send({
					error: `The episode '${req.params.episode}' does not exists in the specified series (${req.parmas.serie})`
				})
			}
		} else {
			// Specified series does not exists
			res.status(400).send({
				error: `'${req.params.serie}' is not a valid serie`
			})
		}
    }
  },
};
