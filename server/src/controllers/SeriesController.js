const {Serie} = require('../models')

module.exports = {
    get (req, res) {
        Serie.findAll().then((users) => {
            res.send(users)
        })
    },
    create (req, res) {
        Serie.findOrCreate({
            defaults: { 
                banner: req.body.file,
                name: req.body.name,
                description: req.body.description || null
            },
            order: [
                ['createdAt', 'ASC'],
            ],
            where: { name: req.body.name }
          }).then(result => {
            let isCreated = result[1]

            if(isCreated){
                // User created
                res.send({message: "Series created successfully"})
            } else {
                // User already exists
                res.status(400).send({error: "Series already exists"})
            }
          })
    },
    delete (req, res) {
        Serie.destroy({
            where: {
                name: req.params.name
            }
        }).then((result) => {
            if(result){
                res.send({
                    message: "Series deleted successfully"
                })
            }
            else{
                res.status(400).send({
                    error: "The specified series does not exists (name: "+req.params.name+")"
                })
            }
        })
    },
    edit (req, res) {
        Serie.update(
            { 
                name: req.body.name,
                banner: req.body.banner,
            },
            { where: { name: req.params.name }}
        ).then((result) => {
            let status = result[0]
            if(status){
                res.send({
                    message: "Series information updated successfully"
                })
            }
            else{
                res.status(400).send({
                    error: "The specified series does not exists (name: "+req.params.name+")"
                })
            }
        })
    }
}