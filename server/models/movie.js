const db = require('./../database/mysql');

module.exports = db.defineModel('movies', {
    movieId: {
        type: db.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imdbId: {
        type: db.STRING(50),
        unique: true
    },
    title: db.STRING(50)
});