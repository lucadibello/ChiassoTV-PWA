const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config')
const db = {}

// Conect to DB
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);

/*
NOTE: LOAD DYNAMICALLY ALL MODELS
  -> NOT USED BECAUSE THE LOAD ORDER IS WRONG (CAN'T USE FOREIGN KEYS)

fs
  .readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    console.log('Loaded:', path.join(__dirname, file))
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
*/

// Load user model
const UserModel = sequelize.import(path.join(__dirname, 'User.js'))
db[UserModel.name] = UserModel

// Load series model
const SeriesModel = sequelize.import(path.join(__dirname, 'Serie.js'))
db[SeriesModel.name] = SeriesModel

// Load episode model
const EpisodeModel = sequelize.import(path.join(__dirname, 'Episode.js'))
db[EpisodeModel.name] = EpisodeModel


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;