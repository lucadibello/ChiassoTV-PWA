// Require modules
const express = require('express');

// Require config
const config = require('../config/config');

// Get router
const router = express.Router();

// Require JWT lib
const jwt = require("jsonwebtoken");

// JWT verify middleware
function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // if there isn't any token
    if (token == null) return res.status(401).send({
        message: "Authorization token needed"
    }) 

    jwt.verify(token, config.jwt.public_key, (err, user) => {
        console.log(err)
        if (err) return res.status(403).send({
            message: "Authorization token not valid"
        })

        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}

// Export middleware
module.exports = authenticateToken;