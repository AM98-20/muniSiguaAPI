require('dotenv').config();

const sequelize = require('sequelize');

const db = new sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.SECRET, {
        host: process.env.HOST,
        dialect: 'mysql',
        port: process.env.PORT
    }
);

module.exports = db;