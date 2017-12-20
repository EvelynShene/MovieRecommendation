require('dotenv').config(); // this loads the defined variables from .env

const config = {
    port: process.env.PORT || 3000,
    sessionKey: process.env.SESSION_KEY || 'secret',

    omdbKey: process.env.OMDB_KEY,

    mysql: {
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST
    },
    mongodb: {
        uri: process.env.MONGO_DB_URI
    }
};

module.exports = config;


