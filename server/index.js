const express = require("express");
const cors = require("cors");

// Create app object
const app = express();

// Set middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());


// Add API posts
const episode = require('./routes/api/episode.js');
app.use('/api/episode', episode)

// Get available port or 5000
const port = process.env.PORT || 5000;

// Start app
app.listen(port, () => console.log(`Server started at ${port}`));

app.route('/');