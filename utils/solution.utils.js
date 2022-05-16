var express = require('express');
var app     = express.Router();
var conn    = require('../dbconfig');


var getAllSolutions = function() {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT 
                    solutions.problem_id as problemId, 
                    problems.name as problemName, 
                    problem_description as problemDescription,
                    problem_type as problemType, 
                    comment as solution,
                    hardware.name as hardwareName,
                    serial,
                    software.name as softwareName,
                    license,
                    os.name as osName,
                    assigned_to as resolvedBy 
                FROM comments 
                JOIN solutions 
                    ON comments.comment_id = solutions.comment_id 
                JOIN problems 
                    ON problems.problem_id = solutions.problem_id 
                JOIN problem_types 
                    ON problem_types.problem_type_id = problems.problem_type_id
                LEFT JOIN hardware 
                    ON hardware.hardware_id = problems.hardware_id
                LEFT JOIN software 
                    ON software.software_id = problems.software_id
                LEFT JOIN os 
                    ON os.os_id = problems.os_id;`,
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

var getSolutionForProblemId = function(problemId) {
    return new Promise((resolve, reject) => {
        conn.query(`
            SELECT solutions.problem_id as problemId, 
            name as problemName, 
            problem_type as problemType, 
            solut.comment as solution, 
            comments.author as author,
            comments.comment as solutionNotes, 
            assigned_to as resolvedBy 
        FROM problems 
        LEFT JOIN solutions 
            ON solutions.problem_id = problems.problem_id 
        LEFT JOIN comments AS solut 
            ON solut.comment_id = solutions.comment_id 
        LEFT JOIN comments 
            ON comments.problem_id = problems.problem_id 
            AND comments.comment_id NOT IN (select comment_id FROM solutions) 
        JOIN problem_types 
            ON problem_types.problem_type_id = problems.problem_type_id 
        WHERE solutions.problem_id = ${problemId} ORDER BY comments.comment_id DESC LIMIT 1;`,
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
                    VALUES (${problemId}, ${author}, "${comment}");`,
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

module.exports = {getAllSolutions, addComments, linkProblemToSolution, getSolutionForProblemId};