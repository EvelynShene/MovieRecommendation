const db = require('./../database/mysql');

module.exports = db.defineModel('ratings', {
    id: {
        type: db.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: db.INTEGER,
    movieId: db.INTEGER,
    rating: db.FLOAT
},
{
    indexes: [
        {
            fields: ['userId', 'movieId']
        }
    ]
});