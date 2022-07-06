const sequelize = require('sequelize');
const db = require('../../config/mysqldb');
const Posts = db.define(
    "posts", {
        idPost: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        postDesc: {
            type: sequelize.STRING(10),
            allowNull: false
        },
        postStatus: {
            type: sequelize.TINYINT,
            allowNull: true,
        }
    }, {
        tableName: "posts",
        timestamps: false
    },
);
module.exports = Posts;