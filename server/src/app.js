// Force NODE_ENV variable status (set local variable if set, otherwise production)
process.env.NODE_ENV = process.env.NODE_ENV === '' ? "development" : process.env.NODE_ENV

const express = require("express"); // Express App
const cors = require("cors"); // Set HEADERS for CORS operations
const bodyParser = require("body-parser"); // Parse HTTP requests to JSON
const morgan = require("morgan"); // Log HTTP request
const helmet = require("helmet"); // Enchanced security
const compression = require("compression"); // Compress routes

// Index.js returns sequelize object
const {sequelize} = require('./models'); // Load Sequelize DB models
const config = require('./config/config'); // Load APP config

// Create app object
const app = express();

// Set middlewares
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(morgan("combined"));
app.use(cors());
app.use(helmet());
app.use(compression())

// Set img directories
app.use('/series', express.static(config.assets.series));
app.use('/hls', express.static(config.assets.hls));

// Set api routes
const login = require('./routes/api/login')
app.use('/api/login', login)

const user = require('./routes/api/user')
app.use('/api/user', user)

const episodes = require('./routes/api/episodes')
app.use('/api/episodes', episodes)

const series = require('./routes/api/series')
app.use('/api/series', series)

const banners = require('./routes/api/banners')
app.use('/api/banners', banners)

const homepage = require('./routes/api/homepage')
app.use('/api/homepage', homepage)

const advertisement = require('./routes/api/advertisement')
app.use('/api/F3334AC9EF26166DEDEBD319A18F9CC7', advertisement)

// Sync database
sequelize.sync()
    .then(() => {
        // Start app
        app.listen(config.port, () => console.log(`Server started at ${config.port}`));
        app.route('/');

        // Output splitter
        console.log('--------------------------------------------')

        // Print enviroment status
        if (process.env.NODE_ENV == "production") {
            console.log('ChiassoTV started in production mode 🏢')
        } else {
            console.log('ChiassoTV started in development mode 👨🏻‍💻')
        }
        // Output splitter
        console.log('--------------------------------------------')
    })