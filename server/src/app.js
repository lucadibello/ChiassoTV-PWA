const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Create app object
const app = express();

// Set middlewares
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cors());


// Add API posts
const episode = require('./routes/api/episode.js');
const login = require('./routes/api/login');

app.use('/api/episode', episode);
app.use('/api/login', login);

// Get available port or 5000
const port = process.env.PORT || 5000;

// Start app
app.listen(port, () => console.log(`Server started at ${port}`));

app.route('/');