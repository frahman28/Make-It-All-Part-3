var express = require('express');
var router = express.Router();

var conn = require('../dbconfig');

//All queries stored as functions to be called in corresponding get route in equipment.js
//Use of promise to pass rows returned outside of functions

//Get all os information
var getAllOS = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                *
                FROM
                os`,
                function(err, rows) {
                    if (err) {
                        reject(err);
                        console.error('Error: ' + err);
                    } else {
                        console.log(rows);
                        return resolve(rows); 
                    }
                })
    })           
};

//Get os info based on inputted id
var getOSById = function(req) {
    return new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
        conn.query(`SELECT 
                    *
                    FROM
                    os
                    WHERE
                    os_id = '${id}'`,
                    function(err, rows) {
                        if (err) {
                            reject(err);
                            console.error('Error: ' + err);
                        } else {
                            console.log(rows);
                            return resolve(rows); 
                        }
                    })
        })           
};

//Add new os to os table
var addOS = function(req, res) {
    const name = req.body.name;
    if (name) {
        try {
            conn.query(`INSERT INTO
                        os
                        (name)
                        Values
                        ('${name}')`);
            res.status(201);
        } catch (err) {
            console.log(err);
            res.render({ message: "Error in request" });
        }
    }
};

//Update os info based on inputted id
var updateOS = function(req, res) {
    const name = req.body.name;
    const id = parseInt(req.params.id);
    if (name) {
        try {
            conn.query(`UPDATE 
                        os
                        SET
                        name = '${name}'
                        WHERE
                        os_id = '${id}'`);
            res.status(200);
        } catch (err) {
            console.log(err);
            res.render({ message: "Error in request" });
        }
    }
};

//Delete os row based on inputted id
var deleteOS = function(req, res) {
    return new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
        conn.query(`DELETE
                    FROM 
                    os
                    WHERE
                    os_id = '${id}'`,
                    function(err, rows) {
                        if (err) {
                            console.error('Error: ' + err);
                            return resolve(err);
                        } else {
                            console.log(rows);
                            return resolve(rows)
                        }
                    })
    })    
};

module.exports = {getAllOS, getOSById, addOS, updateOS, deleteOS};