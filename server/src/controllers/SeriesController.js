const {Serie} = require('../models')
const fs = require('fs')
const config = require('../config/config')
const path = require('path')

function encodeTitle (title) {
    // Get only letters
    let sanitized = title.replace(/[^a-zA-Z ]+/g, '');
    // Replace spaces with dash
    return sanitized.replace(/\s+/g, '-').toLowerCase()
}

rmDir = function(dirPath, removeSelf) {
    if (removeSelf === undefined)
      removeSelf = true;
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    if (removeSelf)
      fs.rmdirSync(dirPath);
  };

module.exports = {
    get (req, res) {
        Serie.findAll({
            order: [
                ['updatedAt', 'DESC']
            ]
        }).then((users) => {
            res.send(users)
        })
    },
    getSerie (req, res) {
        Serie.findOne({
            where: { encoded: req.params.name}
        }).then((users) => {
            res.send(users)
        })
    },
    create (req, res) {
        Serie.findOrCreate({
            defaults: { 
                banner: req.body.file,
                name: req.body.name,
                encoded: encodeTitle(req.body.name),
                description: req.body.description || null
            },
            order: [
                ['createdAt', 'ASC'],
            ],
            where: { encoded: encodeTitle(req.body.name) }
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
        // Read series banner filename
        Serie.findOne({
            attributes: ['banner'],
            where: { encoded: req.params.name}
        }).then((banner) => {
            // Delete banner from assets directory
            const filename = banner.dataValues.banner
            
            // Cycle every file inside assets/series directory
            let files = fs.readdirSync(config.assets.series)

            // Delete file
            files.forEach((file) => {
                if (file === filename) {
                    fs.unlinkSync(path.resolve(config.assets.series, filename))
                }
            })

            // Delete episode directory
            let directories = fs.readdirSync(config.assets.episodes)
            
            console.log(directories)

            // Delete specific directory
            directories.forEach((dir) => {
                if (dir === req.params.name) {
                    // Remove all files in directory + directory itselfw
                    rmDir(path.resolve(config.assets.episodes, dir), true)
                }
            })
 
            // Remove series record from DB
            Serie.destroy({
                where: {
                    encoded: req.params.name
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
        })  
    },
    edit (req, res) {
        Serie.update(
            { 
                name: req.body.name,
                banner: req.body.banner,
                encoded: encodeTitle(req.body.name)
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