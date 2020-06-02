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

sequelize.sync()
    .then(() => {
        // Start app
        app.listen(config.port, () => console.log(`Server started at ${config.port}`));
        app.route('/');
    })