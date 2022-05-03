var express = require('express');
var app     = express.Router();
var conn    = require('../dbconfig');


var getAllSolutions = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                        solutions.problem_id as problemId, 
                        name as problemName, 
                        problem_type as problemType, 
                        comment as solution, 
                        assigned_to as resolvedBy 
                    FROM comments 
                    JOIN solutions 
                        ON comments.comment_id = solutions.comment_id 
                    JOIN problems 
                        ON problems.problem_id = solutions.problem_id 
                    JOIN problem_types 
                        ON problem_types.problem_type_id = problems.problem_type_id;`,
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

module.exports = {getAllSolutions};