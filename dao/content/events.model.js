const sequelize = require('sequelize');
const User = required('../../user.model');
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
            allowNull: false,
            unique: true
        },
        eventStatus: {
            type: sequelize.ENUM,
            allowNull: false,
        },
        imgPortada: {
            type: sequelize.STRING(250),
            allowNull: false
        },
        idUser: {
            type: sequelize.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: "users",
        timestamps: false
    },
);
//user-event relation
User.hasOne(Events, { foreignKey: 'idUser' });
Events.belongsTo(User, { foreignKey: 'idUser' });

module.exports = Events;