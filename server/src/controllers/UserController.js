
const {User} = require('../models')

module.exports = {
    create (req, res) {
        User.findOrCreate(req.body.username).then((result) => {
            let user = result[0], isCreated = result[1]

            if(isCreated){
                // User created
                res.send({message: "User created successfully"})
            }
            else{
                // User already exists
                res.status(400).send({message: "User already exists"})
            }
        })

    }
}