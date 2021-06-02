const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // add password to database
    database: 'employees_example_db',
});

module.exports = { connection };