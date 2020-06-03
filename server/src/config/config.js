module.exports = {
    port: 5000,
    db: {
        database: process.env.DB_NAME || 'chiassotv2',
        user: process.env.DB_USER ||'root',
        password: process.env.DB_PASS ||'',
        options: {
            dialect: process.env.DIALECT || 'mysql',
            host: process.env.HOST || 'localhost'
        }
    }
}