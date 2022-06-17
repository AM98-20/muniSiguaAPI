const mysql = require('mysql2');
require('dotenv').config();

let db = null;
let client = null;

const getDb = async () => {
    try {
        client = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.SECRET,
            database: process.env.DATABASE
        });
        db = client;
    } catch (error) {
        console.error(error);
    }
    return db;
}

module.exports = { getDb };