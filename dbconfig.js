const mysql = require('mysql');

//local mysql db connection
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : '',
    multipleStatements: true
});

// const connection = mysql.createConnection({
//     host : 'localhost',
//     user : 'teamb015',
//     password : 'UU5QXjvl3f',
//     database : 'teamb015'
// });

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

connection.query('CREATE DATABASE IF NOT EXISTS teamb015; USE teamb015;', function (error, results, fields) {
    if (error) throw error;
});

module.exports = connection;
