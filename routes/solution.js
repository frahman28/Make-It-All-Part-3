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

var addComments = function(problemId, author, comment) {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO comments (problem_id, author, comment)
                    VALUES (${problemId}, ${author}, "${comment}");
                    SELECT COUNT(*) AS last_id FROM comments;`,
                function(err, rows) { 
                    if (err) {
                        reject(err);
                        console.error('Error: ' + err);
                    } else {
                        return resolve(rows); 
                    } 
                });
    })            
};

var linkProblemToSolution  = function(problemId, commentId) {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO solutions (problem_id, comment_id)
                    VALUES (${problemId}, ${commentId})
                    ON DUPLICATE KEY UPDATE    
                    comment_id=${commentId};`,
                function(err, rows) { 
                    if (err) {
                        reject(err);
                        console.error('Error: ' + err);
                    } else {
                        console.log(rows);
                        return resolve(rows); 
                    } 
                });
    });
};

module.exports = {getAllSolutions, addComments, linkProblemToSolution};