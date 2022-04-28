var express = require('express');
var router = express.Router();

var conn = require('../config');

//All queries stored as functions to be called in corresponding get route in equipment.js
//Use of promise to pass rows returned outside of functions

//Get all data for software, including type names and licenses
var getAllSoftware = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                software.software_id, name, type_of_software.type, software_relation.license
                FROM
                software 
                LEFT JOIN 
                software_relation
                ON
                software_relation.software_id = software.software_id
                LEFT JOIN
                type_of_software
                ON 
                software.type_id = type_of_software.type_id`,
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

//Get all software types to display (for simpler changing/updating types?)
var getSoftwareTypes = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                *
                FROM
                type_of_software`,
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

//Get software info based on inputted id, including type name and license
var getSoftwareById = function(req) {
    return new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
    conn.query(`SELECT 
                software.software_id, name, type_of_software.type, software_relation.license
                FROM
                software 
                LEFT JOIN 
                software_relation
                ON
                software_relation.software_id = software.software_id
                LEFT JOIN
                type_of_software
                ON 
                software.type_id = type_of_software.type_id
                WHERE
                software.software_id = '${id}'`,
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

//Add new software to software table and license to software relation table
var addSoftware = function(req, res) {
    const { name, type, license } = req.body;
    if (name && type && license) { //Check if all required data is inputted
        try {
            conn.query(`SELECT 
                        *
                        FROM 
                        type_of_software
                        WHERE
                        type = '${type}'`,
                        function(err, rows) {
                            if (err) {
                                console.error('Error: ' + err);
                            } else { //Insert correct type id pulled from type of software table based on inputted type name
                                const type_id = rows[0]["type_id"] 
                                conn.query(`INSERT INTO 
                                            software
                                            (name, type_id)
                                            VALUES
                                            ('${name}', '${type_id}')`,
                                            function(err, rows) {
                                                if (err) {
                                                    console.error('Error: ' + err);
                                                } else {
                                                    conn.query(`SELECT
                                                                *
                                                                FROM 
                                                                software
                                                                ORDER BY
                                                                software_id
                                                                DESC
                                                                LIMIT 
                                                                1`,
                                                                function(err, rows) {
                                                                    if (err) {
                                                                        console.error('Error: ' + err);
                                                                    } else { //Insert license with same software id pulled from row just inserted into software table
                                                                        const id = rows[0]["software_id"]
                                                                        conn.query(`INSERT INTO
                                                                        software_relation
                                                                        (software_id, license)
                                                                        VALUES
                                                                        ('${id}', '${license}')`)
                                                                    }
                                                                })
                                                }
                                            });
                            }
                        })    
            res.status(201);
        } catch (err) {
            console.log(err);
            res.render({ message: "Error in request" });
        }
    }
};

//Update software info based on inputted id
var updateSoftware = function(req, res) {
    const { name, type, license } = req.body;
    const id = parseInt(req.params.id);
    try { //Update each attribute seperately incase certain attributes are not inputted
        if (name) { 
            conn.query(`UPDATE 
                        software
                        SET
                        name = '${name}'
                        WHERE
                        software_id = '${id}'`);
        }
        if (type) {
            conn.query(`SELECT 
                        *
                        FROM 
                        type_of_software
                        WHERE
                        type = '${type}'`,
                        function(err, rows) {
                            if (err) {
                                console.error('Error: ' + err);
                            } else {
                                const type_id = rows[0]["type_id"]
                                conn.query(`UPDATE 
                                            software
                                            SET
                                            type_id = '${type_id}'
                                            WHERE
                                            software_id = '${id}'`);
                            }
                        })
        }
        res.status(200);
    } catch (err) {
        console.log(err);
        res.render({ message: "Error in request" });
    }
};

var deleteSoftware = function(req, res) {
    const id = parseInt(req.params.id);
    try {
        conn.query(`DELETE
                    FROM 
                    software_relation
                    WHERE
                    software_id = '${id}'`, 
                    function(err, rows) {
                        if (err) {
                            console.error('Error: ' + err);
                        } else {
                            conn.query(`DELETE
                                        FROM 
                                        software
                                        WHERE
                                        software_id = '${id}'`);
                        }
                    })
        res.status(200);
    } catch (err) {
        console.log(err);
        res.render({ message: "Error in request" });
    }
};

module.exports = {getAllSoftware, getSoftwareTypes, getSoftwareById, addSoftware, updateSoftware, deleteSoftware};