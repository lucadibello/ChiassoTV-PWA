const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Index.js returns sequelize object
const {sequelize} = require('./models');
const config = require('./config/config');

// Create app object
const app = express();

// Set middlewares
app.use(bodyParser.json());

app.use(morgan("combined"));
app.use(cors());

// Set api routes
const login = require('./routes/api/login')
app.use('/api/login', login)

const user = require('./routes/api/user')
app.use('/api/user', user)

const episode = require('./routes/api/episode')
app.use('/api/episode', episode)


// Sync database
sequelize.sync()
    .then(() => {
        // Start app
        app.listen(config.port, () => console.log(`Server started at ${config.port}`));
        app.route('/');
    })