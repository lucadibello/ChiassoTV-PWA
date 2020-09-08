const fs = require('fs');
const path = require('path');

// Load development / production config
const _configFile = process.env.NODE_ENV == 'production' ? './prod.config.json' : './dev.config.json'
const confidentialConfig = require(_configFile)

// Generic config
let config = {
    jwt: {
        private_key: process.env.JWT_PRIVATE_KEY || fs.readFileSync(path.resolve(__dirname, 'private.pem')),
        public_key: process.env.JWT_PUBLIC_KEY || fs.readFileSync(path.resolve(__dirname, 'public.pem')),
        passphrase: process.env.JWT_PASSPHRASE || 'Chiassotv&1'
    }
}


console.log(config)

// Combine configs
config = Object.assign(config, confidentialConfig)

// Load config
module.exports = config