// Require config
const config = require('../config/config');

// Require JWT lib
const jwt = require("jsonwebtoken");

// Export middleware
module.exports = {
    authenticateToken(req, res, next) {
        // Gather the jwt access token from the request header
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        // if there isn't any token
        if (token == null) return res.status(401).send({
            message: "Authorization token needed"
        }) 
    
        jwt.verify(token, config.jwt.public_key, (err, user) => {
            if (err) return res.status(403).send({
                message: "Authorization token not valid"
            })
    
            // Proceeed to data validation
            next()
        })
    }
};