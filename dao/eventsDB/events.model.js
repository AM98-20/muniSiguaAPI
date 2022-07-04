const sequelize = require('sequelize');
const db = require('../../config/mysqldb');

const User = require('../users/user.model');
const userModel = new User();

const Events = db.define(
    "users", {
        idUser: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: sequelize.STRING(10),
            allowNull: false,
            unique: true
        },
        name: {
            type: sequelize.STRING(55),
            allowNull: false,
        },
        surname: {
            type: sequelize.STRING(55),
            allowNull: false,
        },
        email: {
            type: sequelize.STRING(250),
            allowNull: false,
            unique: true
        },
        idPost: {
            type: sequelize.INTEGER,
            allowNull: false,
        },
        state: {
            type: sequelize.TINYINT,
            allowNull: true,
        }
    }, {
        tableName: "users",
        timestamps: false
    },
);
module.exports = Events;