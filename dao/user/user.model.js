const sequelize = require('sequelize');
const db = require('../../config/mysqldb');
const Users = db.define(
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
        password: {
            type: sequelize.STRING(250),
            allowNull: false
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
module.exports = Users;