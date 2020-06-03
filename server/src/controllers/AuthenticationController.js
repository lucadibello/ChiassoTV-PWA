const bcrypt = require('bcrypt')
const {User} = require('../models')

const error_message = "Wrong username or password"

module.exports = {
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
                        res.send({
                            logged: true,
                            message: "Logged in successfully"
                        })
                    }
                })
            }
        })
    }
}