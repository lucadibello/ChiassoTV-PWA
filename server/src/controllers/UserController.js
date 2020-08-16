
const {User, Serie} = require('../models')
const bcrypt = require('bcrypta')

module.exports = {
    get (req, res) {
        User.findAll({attributes: ['username', 'name', 'surname']}).then((users) => {
            res.send(users)
        })
    },
    create (req, res) {
        // Hash password
        let hashed = bcrypt.hashSync(req.body.password, 12);

        User.findOrCreate({
            defaults: { 
                username: req.body.username,
                password: hashed,
                name: req.body.name,
                surname: req.body.surname
            },
            where: { username: req.body.username }
          }).then(result => {
            let isCreated = result[1]

            if(isCreated){
                // User created
                res.send({message: "User created successfully"})
            }
            else{
                // User already exists
                res.status(400).send({message: "User already exists"})
            }
          });
    },
    delete (req, res) {
        User.destroy({
            where: {
                username: req.params.username
            }
        }).then((result) => {
            if(result){
                res.send({
                    message: "User deleted successfully"
                })
            }
            else{
                res.status(400).send({
                    error: "The specified user does not exists (username: "+req.params.username+")"
                })
            }
        })
    },
    edit (req, res) {
        Serie.update(
            { 
                username: req.body.username,
                name: req.body.name,
                surname: req.body.surname
            },
            { where: { username: req.params.username }}
        ).then((result) => {
            if(result){
                res.send({
                    message: "User information updated successfully"
                })
            }
            else{
                res.status(400).send({
                    error: "The specified user does not exists (username: "+req.params.username+")"
                })
            }
        })
    }
}