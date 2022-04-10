// problems.js
// Has routes and endpoints that handle problems 
// retrieval from the problem table in  database.


var express = require('express');
var app     = express.Router();
var conn    = require('../dbconfig');
var moment  = require('moment');
var {verifySession, checkRoles} = require("./auth.middleware");


// route:  GET /
// access: ALL NOT LOGGED IN
// Navigates user to their dashboard, if they are logged in
// (session exists). Otherwise regirect to the login page
// and show error message.
app.get('/', function (req, res, next) {
    if (req.session) {
        res.redirect('/myProblems');
    } else {
        res.redirect("../login");
    } 
});


// route:  GET /myProblems
// access: ADMINS, ADVISERS
// Navigates users of role Admin or Adviser to their own
// dashboards.
app.get('/myProblems', checkRoles("admin", "adviser"), function (req, res, next) {
    res.render('dashboard');
});


// route:  GET /myProblems
// access: SPECIALISTS, EMPLOYEES
// Navigates users of role Specialist or Employee to their own
// dashboards. Displays for each of them their assigned or reported problems,
// which have not been resolved.
app.get('/myProblems', checkRoles("specialist", "employee"), function(req, res, next) {
    // Change query sytax depending on current user's role.
    let query = req.session.userRole === 'specialist' ? 'assigned_to' : 'employee';

    // Retrieve details about user's open problems.
    conn.query(`SELECT problems.problem_id as problemId,
                problems.name as problemName,
                employee as reportedById,
                assigned_to as specialistId,
                employees.name as reportedByName,
                specialists.name as specialistName,
                opened_on as dateOpened,
                closed_on as dateClosed,
                status
                FROM employees as specialists, employees, problems, problem_status, problem_status_relation 
                WHERE problem_status_relation.status_id = problem_status.status_id
                AND problems.problem_id = problem_status_relation.problem_id 
                AND specialists.employee_id = assigned_to
                AND employees.employee_id = employee
                AND closed <> 1
                AND ${query} = ${req.session.userId}
                ORDER BY problems.problem_id ASC;`,  function (err, rows) {
        if (err){
            // If error occured, return an empty array.
            res.render('problems/my_problems', {userName: req.session.userName,     // displays user's username.
                                            moment: moment,                         // used for date formatting.
                                            problems: [],                           // empty array of problems.
                                            role: req.session.userRole});           // used for dynamic rendering (decides which column 
                                                                                    // should be displayed).
        } else {
        // Otherwise return an array of problems..
        res.render('problems/my_problems', {userName: req.session.userName,         // displays user's username.
                                            moment: moment,                         // used for date formatting.
                                            problems: rows,                         // array of problems.
                                            role: req.session.userRole});           // used for dynamic rendering (decides which column 
                                                                                    // should be displayed).
        }
    });
});


// route:  GET /allProblems
// access: SPECIALISTS, EMPLOYEES
// Navigates users of role Specialist or Employee to their own
// dashboards. Displays for each of them their assigned or reported problems,
// which have not been resolved.
app.all('/allProblems', checkRoles("specialist", "employee"), function (req, res, next) {
    // Retrieve details about user's open problems.
    conn.query(`SELECT problems.problem_id as problemId,
                problems.name as problemName,
                employee as reportedById,
                assigned_to as specialistId,
                employees.name as reportedByName,
                specialists.name as specialistName,
                opened_on as dateOpened,
                closed_on as dateClosed,
                status
                FROM employees as specialists, employees, problems, problem_status, problem_status_relation
                WHERE problem_status_relation.status_id = problem_status.status_id
                AND problems.problem_id = problem_status_relation.problem_id
                AND specialists.employee_id = assigned_to
                AND employees.employee_id = employee
                ORDER BY problems.problem_id ASC;`, function (err, rows) {
        if (err) {
        // If error occured, return an empty array.
            res.render('problems/all_problems', {userName: req.session.userName,     // displays user's username.
                                                moment: moment,                      // used for date formatting.
                                                problems: []});                      // empty array of problems.
        } else {
            res.render('problems/all_problems', {userName: req.session.userName,     // displays user's username.
                                                moment: moment,                      // used for date formatting.
                                                problems: rows});                    // array of problems.
        }
    });
});

module.exports = app;
