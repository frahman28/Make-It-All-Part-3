var express = require('express');
var router = express.Router();

var conn = require('../dbconfig');

//Get each unique data for specialists, including id, name, extension and specialty
var getUniqueSpecialists = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                employee_id AS id, name
                FROM
                employees
                WHERE
                role_id = 5`,
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

//Get all data for specialists, including id, name, extension and specialty
var getAllSpecialists = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                employees.employee_id AS id, name, employees.extension AS ext, employee_problem_type_relation.problem_type_id AS specialty_id, problem_types.problem_type AS specialty, employees.available AS availability
                FROM
                employees
                LEFT JOIN 
                employee_problem_type_relation
                ON
                employees.employee_id = employee_problem_type_relation.employee_id
                LEFT JOIN
                problem_types
                ON 
                employee_problem_type_relation.problem_type_id = problem_types.problem_type_id
                WHERE
                employees.role_id = 5`,
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

module.exports = {getUniqueSpecialists, getAllSpecialists};