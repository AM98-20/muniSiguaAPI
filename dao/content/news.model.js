const sequelize = require('sequelize');
const Users =require('../user/user.model');
const db = require('../../config/mysqldb');
const News = db.define(
    "news", {
        idNews: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        newsName: {
            type: sequelize.STRING(30),
            allowNull: false
        },
        newsDesc: {
            type: sequelize.STRING(45),
            allowNull: false,
        },
        newsBody: {
            type: sequelize.STRING(750),
            allowNull: false,
        },
        newsDate: {
            type: sequelize.DATEONLY,
            allowNull: true
        },
        idEditor: {
            type: sequelize.INTEGER,
            allowNull: true,
        },
        imgPortada: {
            type: sequelize.STRING(100),
            allowNull: false
        }
    }, {
        tableName: "news",
        timestamps: false
    },
);
//user-event relation
News.hasOne(Users, { foreignKey: 'idUser' });
Users.belongsTo(News, { foreignKey: 'idEditor' });

module.exports = News;