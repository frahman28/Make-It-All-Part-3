// problems.js
// Has routes and endpoints that handle problems 
// retrieval from the problem table in  database.


var express = require('express');
var app     = express.Router();
var conn    = require('../dbconfig');
var moment  = require('moment');
var {verifySession, checkRoles} = require("./auth.middleware");
var software = require("./software");
var hardware = require("./hardware");
var os = require("./os");
var solution = require("./solution");
var problemTypes = require("./problem-type-fun");

// route:  GET /
// access: ALL NOT LOGGED IN
// Navigates user to their dashboard, if they are logged in
// (session exists). Otherwise regirect to the login page
// and show error message.
app.get('/', function (req, res, next) {
    if (req.session.userId) {
        res.redirect('/myProblems');
    } else {
        res.redirect("../login");
    } 
});


// route:  GET /myProblems
// access: ADMINS, ADVISERS
// Navigates users of role Admin or Adviser to their own
// dashboards.
app.get('/dashboard', checkRoles("admin", "adviser"), function (req, res, next) {
    res.render('dashboard');
});


// route:  GET /myProblems
// access: SPECIALISTS, EMPLOYEES
// Navigates users of role Specialist or Employee to their own
// dashboards. Displays for each of them their assigned or reported problems,
// which have not been resolved.
app.get('/myProblems', checkRoles("specialist", "employee"), function(req, res, next) {
    // Change query sytax depending on current user's role.
    let query  = req.session.userRole === 'specialist' ? 'assigned_to' : 'employee';
    let userId = req.session.userId;

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
                FROM problems
                LEFT JOIN employees 
                    ON employees.employee_id = employee
                LEFT JOIN employees as specialists 
                    ON specialists.employee_id = assigned_to
                LEFT JOIN problem_status_relation 
                    ON problems.problem_id = problem_status_relation.problem_id 
                LEFT JOIN problem_status 
                    ON problem_status_relation.status_id = problem_status.status_id
                WHERE closed <> 1
                AND ${query} = ${userId}
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
            res.render('problems/my_problems', {userName: req.session.userName,     // displays user's username.
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
                    employees.name as reportedByName,
                    specialists.name as specialistName,
                    opened_on as dateOpened,
                    closed_on as dateClosed,
                    status,
                    solut.comment as solution,
                    comments.comment,
                    os.name as OS,
                    software.name as softwareName,
                    type_of_software.type as softwareType,
                    hardware.name as hardwareName,
                    type_of_hardware.type as hardwareType,
                    hardware_relation.serial as serialNumber
                FROM problems
                JOIN employees as specialists 
                    ON specialists.employee_id = assigned_to
                JOIN employees 
                    ON employees.employee_id = employee
                LEFT JOIN os 
                    ON os.os_id = problems.os_id
                LEFT JOIN hardware 
                    ON hardware.hardware_id = problems.hardware_id
                LEFT JOIN type_of_hardware 
                    ON type_of_hardware.type_id = hardware.type_id
                LEFT JOIN software 
                    ON software.software_id = problems.software_id
                LEFT JOIN type_of_software 
                    ON type_of_software.type_id = software.type_id
                LEFT JOIN hardware_relation 
                    ON hardware_relation.hardware_id = hardware.hardware_id
                LEFT JOIN problem_status_relation 
                    ON problems.problem_id = problem_status_relation.problem_id
                LEFT JOIN problem_status
                    ON problem_status_relation.status_id = problem_status.status_id
                LEFT JOIN solutions 
                    ON solutions.problem_id = problems.problem_id
                LEFT JOIN comments AS solut 
                    ON solut.comment_id = solutions.comment_id
                LEFT JOIN comments 
                    ON comments.problem_id = problems.problem_id 
                    AND comments.comment_id NOT IN (select comment_id FROM solutions)
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

app.get("/submitProblem", checkRoles("employee", "specialist"), async function (req, res, next) {
    var allSoftware = await software.getAllSoftware();
    var allHardware = await hardware.getAllHardware();
    var allOS = await os.getAllOS();
    var allSolutions = await solution.getAllSolutions();
    var allProblemTypes = await problemTypes.getAllProblemTypes();

    res.render('submitProblem', {userName: req.session.userName,
                                software: allSoftware,
                                hardware: allHardware,
                                os: allOS,
                                solution: allSolutions,
                                problemTypes: allProblemTypes
                            });
});

app.post("/submitProblem", checkRoles("employee", "specialist"), function (req, res, next) {
    
});

module.exports = app;
