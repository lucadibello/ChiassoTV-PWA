const fs = require('fs');
const path = require('path');

module.exports = {
    port: 5000,
    db: {
        database: process.env.DB_NAME || 'chiassotv2',
        user: process.env.DB_USER ||'root',
        password: process.env.DB_PASS ||'root',
        options: {
            dialect: process.env.DIALECT || 'mysql',
            host: process.env.HOST || 'localhost'
        }
    },
    jwt: {
        private_key: process.env.JWT_PRIVATE_KEY || fs.readFileSync(path.resolve(__dirname, 'private.pem')),
        public_key: process.env.JWT_PUBLIC_KEY || fs.readFileSync(path.resolve(__dirname, 'public.pem')),
        passphrase: process.env.JWT_PASSPHRASE || 'Chiassotv&1'
    },
    assets: {
        series: process.env.ASSETS_SERIES || path.resolve(__dirname, '..', '..', 'assets/series'),
        hls: process.env.ASSETS_SERIES || path.resolve(__dirname, '..', '..', 'assets/hls'),
        episodes: process.env.ASSETS_EPISODES || path.resolve(__dirname, '..', '..', 'assets/episodes')
    }
}