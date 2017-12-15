const db = require('./../database/mysql');

module.exports = db.defineModel('users', {
    id: {
        type: db.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: db.STRING(50),
        unique: true
    },
    email: {
        type: db.STRING(50),
        unique: true
    },
    password: db.STRING(50)
});