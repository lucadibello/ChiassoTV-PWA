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

// Set img directories
app.use('/series', express.static(config.assets.series));

// Set api routes
const login = require('./routes/api/login')
app.use('/api/login', login)

const user = require('./routes/api/user')
app.use('/api/user', user)

const episode = require('./routes/api/episode')
app.use('/api/episode', episode)

const series = require('./routes/api/series')
app.use('/api/series', series)

const banners = require('./routes/api/banners')
app.use('/api/banners', banners)


// Sync database
sequelize.sync()
    .then(() => {
        // Start app
        app.listen(config.port, () => console.log(`Server started at ${config.port}`));
        app.route('/');
    })