/* This file handles the connection to the MySQL database using the credentials in our .env file. */

const mysql = require('mysql2');

/** The connection configuration for the database. */
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// log to the console if the database was able to be connected to
db.getConnection((err) => {
    if (err) console.log(err);
    else console.log('The Express server is connected to the gatormmunity database.');
});

module.exports = db.promise();