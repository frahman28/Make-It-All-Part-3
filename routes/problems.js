var express = require('express');
var app = express.Router();
var conn  = require('../dbconfig');
var moment = require('moment');
const {verifySession, checkRoles} = require("./middleware");

// var requireAuth = passport.authenticate('jwt', {session: true});


/* GET dashboard page. */
app.get('/', function(req, res, next) {
  if (req.session) res.redirect('/myProblems');
  else res.redirect("../login", {errorMessage: "User not logged in."})
  });

// FOR TESTING
app.get('/myProblems', checkRoles("admin", "adviser"), function(req, res, next) {
    res.render('dashboard');
});

  // GET ALL UNRESOLVED PROBLEMS FOR A SPECIFIC EMPLOYEE
app.get('/myProblems', checkRoles("specialist", "employee"), function(req, res, next) {
    let query = req.session.userRole == 'specialist' ? 'assigned_to' : 'employee';

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
              AND ${query} = ? 
              ORDER BY problems.problem_id ASC;`, 
            req.session.userId, 
            function(err, rows) {
        if(err){
            req.flash('error', err)
            res.render('problems/my_problems',
                        {userName: req.session.userName,
                          moment: moment,
                          problems: '',
                          role: req.session.userRole});   
        }else{
            res.render('problems/my_problems',
                        {userName: req.session.userName,
                          moment: moment,
                          problems: rows,
                          role: req.session.userRole});
        }
    });
  });
  
  // GET ALL PROBLEMS FOR A SPECIFIC EMPLOYEE
  app.all('/allProblems', checkRoles("specialist", "employee"), function(req, res, next) {
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
              ORDER BY problems.problem_id ASC;`, 
            req.session.userId, 
            function(err, rows) {
        if(err){
            req.flash('error', err)
            res.render('problems/all_problems',
                        {userName: req.session.userName, 
                          moment: moment,
                          problems: ''});
        }else{
            res.render('problems/all_problems',
                        {userName: req.session.userName, 
                          moment: moment,
                          problems: rows});
        }
    });
  });

module.exports = app;
