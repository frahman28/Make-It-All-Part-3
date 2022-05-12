var express = require('express');
var router = express.Router();

var conn = require('../dbconfig');

//All queries stored as functions to be called in corresponding get route in equipment.js
//Use of promise to pass rows returned outside of functions

//Get all data for hardware, including type names and serials
var getAllHardware = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
        hardware.hardware_id, name, type_of_hardware.type, hardware_relation.serial
        FROM
        hardware 
        LEFT JOIN 
        hardware_relation
        ON
        hardware_relation.hardware_id = hardware.hardware_id
        LEFT JOIN
        type_of_hardware
        ON 
        hardware.type_id = type_of_hardware.type_id`,
                function(err, rows) { 
                    if (err) {
                        reject(err);
                        console.error('Error: ' + err);
                    } else {
                        return resolve(rows); 
                    } 
                })
    })            
};

//Get all hardware types to display (for simpler changing/updating types?)
var getHardwareTypes = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                    *
                    FROM
                    type_of_hardware`,
                    function(err, rows) {
                        if (err) {
                            reject(err);
                            console.error('Error: ' + err);
                        } else {
                            return resolve(rows); 
                        }
                    })
    })
};

//Get hardware info based on inputted id, including type name and serial
var getHardwareById = function(req) {
    return new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
        conn.query(`SELECT 
                    hardware.hardware_id, name, type_of_hardware.type, hardware_relation.serial
                    FROM
                    hardware 
                    LEFT JOIN 
                    hardware_relation
                    ON
                    hardware_relation.hardware_id = hardware.hardware_id
                    LEFT JOIN
                    type_of_hardware
                    ON 
                    hardware.type_id = type_of_hardware.type_id
                    WHERE
                    hardware.hardware_id = '${id}'`,
                    function(err, rows) {
                        if (err) {
                            reject(err);
                            console.error('Error: ' + err);
                        } else {
                            return resolve(rows); 
                        }
                    })
    })                
};

//Add new hardware to hardware table and serial to hardware relation table
var addHardware = function(req, res, next) {
    const { name, type, serial } = req.body;
    if (name && type && serial) { //Check if all required data is inputted
        try {
            conn.query(`SELECT 
                        *
                        FROM 
                        type_of_hardware
                        WHERE
                        type = '${type}'`,
                        function(err, rows) {
                            if (err) {
                                console.error('Error: ' + err);
                            } else { //Insert correct type id pulled from type of hardware table based on inputted type name
                                const type_id = rows[0]["type_id"] 
                                conn.query(`INSERT INTO 
                                            hardware
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
                                                                hardware
                                                                ORDER BY
                                                                hardware_id
                                                                DESC
                                                                LIMIT 
                                                                1`,
                                                                function(err, rows) {
                                                                    if (err) {
                                                                        console.error('Error: ' + err);
                                                                    } else { //Insert serial with same hardware id pulled from row just inserted into hardware table
                                                                        const id = rows[0]["hardware_id"]
                                                                        conn.query(`INSERT INTO
                                                                        hardware_relation
                                                                        (hardware_id, serial)
                                                                        VALUES
                                                                        ('${id}', '${serial}')`)
                                                                    }
                                                                })
                                                }
                                            });
                            }
                        })    
            res.status(201);
        } catch (err) {
            console.error('Error: ' + err);
            reject(err);
        }
    }
};

//Update hardware info based on inputted id
var updateHardware = function(req, res) {
    const { name, type, serial} = req.body;
    const id = parseInt(req.params.id);
    try { //Update each attribute seperately incase certain attributes are not inputted
        if (name) { 
            conn.query(`UPDATE 
                        hardware
                        SET
                        name = '${name}'
                        WHERE
                        hardware_id = '${id}'`);
        }
        if (type) {
            conn.query(`SELECT 
                        *
                        FROM 
                        type_of_hardware
                        WHERE
                        type = '${type}'`,
                        function(err, rows) {
                            if (err) {
                                console.error('Error: ' + err);
                            } else {
                                const type_id = rows[0]["type_id"]
                                conn.query(`UPDATE 
                                            hardware
                                            SET
                                            type_id = '${type_id}'
                                            WHERE
                                            hardware_id = '${id}'`);
                            }
                        })
        }
        res.status(200);
    } catch (err) {
        console.log(err);
        res.render({ message: "Error in request" });
    }
};

//Delete hardware row based on inputted id
var deleteHardware = function(req, res) {
    return new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
        conn.query(`DELETE
                    FROM 
                    hardware_relation
                    WHERE
                    hardware_id = '${id}'`, 
                    function(err, rows) {
                        if (err) {
                            console.error('Error: ' + err);
                            return resolve(err);
                        } else { //Delete from relation table first so avoid foreign key errors
                            conn.query(`DELETE
                                        FROM 
                                        hardware
                                        WHERE
                                        hardware_id = '${id}'`,
                                        function(err, rows) {
                                            if (err) {
                                                console.error('Error: ' + err);
                                                return resolve(err);
                                            } else {
                                                console.log(rows);
                                                return resolve(rows)
                                            }
                                        });
                        }
                    })
    })
};

module.exports = {getAllHardware, getHardwareTypes, getHardwareById, addHardware, updateHardware, deleteHardware};