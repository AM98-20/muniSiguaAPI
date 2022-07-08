const sequelize = require('sequelize');
const Users =require('../user/user.model');
const db = require('../../config/mysqldb');
const Events = db.define(
    "events", {
        idEvent: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        eventName: {
            type: sequelize.STRING(45),
            allowNull: false
        },
        eventDescription: {
            type: sequelize.STRING(750),
            allowNull: false,
        },
        eventDate: {
            type: sequelize.DATEONLY,
            allowNull: false,
        },
        publishedDate: {
            type: sequelize.DATEONLY,
            allowNull: true
        },
        eventStatus: {
            type: sequelize.ENUM('CNLD', 'FNLD', 'PRXM'),
            allowNull: false,
        },
        idPublisher: {
            type: sequelize.INTEGER,
            allowNull: true,
        },
        imgPortada: {
            type: sequelize.STRING(250),
            allowNull: false
        }
    }, {
        tableName: "events",
        timestamps: false
    },
);
//user-event relation
Events.hasOne(Users, { foreignKey: 'idUser' });
Users.belongsTo(Events, { foreignKey: 'idPublisher' });

module.exports = Events;