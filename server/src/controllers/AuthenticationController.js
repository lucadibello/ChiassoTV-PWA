const bcrypt = require('bcrypt')
const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config');

const error_message = "Wrong username or password"

module.exports = {
    encrypt (req, res) {
        const data = bcrypt.hashSync('root', 12)
        res.send(data)
    },
    login (req, res) {
        User.findByPk(req.body.username).then((user) =>{
            if (!user){
                res.status(400).send({
                    error: error_message
                })
            }
            else{
                bcrypt.compare(req.body.password, user.dataValues.password).then((result) => {
                    if(!result){
                        res.status(400).send({
                            error: error_message
                        })
                    }
                    else{
                        // Generate JWT token for user
                        const jwt_token = jwt.sign({ username: req.body.username}, {key: config.jwt.private_key, passphrase: config.jwt.passphrase},
                        {
                            algorithm:"RS256",
                            expiresIn: '2h'
                        });
                        
                        // Send response
                        res.send({
                            logged: true,
                            message: "Logged in successfully",
                            token: jwt_token
                        })
                    }
                })
            }
        })
    }
}