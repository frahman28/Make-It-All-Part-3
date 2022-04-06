var express = require('express');
var app = express.Router();
var conn  = require('../dbconfig');
var moment = require('moment');

/* GET dashboard page. */
app.get('/', function(req, res, next) {
  res.redirect('/employee/reportedProblems');
});

// GET ALL UNRESOLVED PROBLEMS FOR A SPECIFIC EMPLOYEE
// Restrict to Employees
app.all('/reportedProblems', function(req, res, next) {
  conn.query(`SELECT problems.problem_id as problemId, 
            problems.name as problemName, 
            employee as employeeId, 
            employees.name as specialistName, 
            opened_on as dateOpened, 
            status 
            FROM employees, problems, problem_status, problem_status_relation 
            WHERE problem_status_relation.status_id = problem_status.status_id
            AND problems.problem_id = problem_status_relation.problem_id 
            AND employees.employee_id = assigned_to
            AND closed <> 1 
            AND employee = ? 
            ORDER BY problems.problem_id ASC;`, 
          req.session.userId, 
          function(err, rows) {
      if(err){
          req.flash('error', err)
          res.render('problems/my_problems',
                      {userName: req.session.userName,
                        moment: moment,
                        problems: ''});   
      }else{
          res.render('problems/my_problems',
                      {userName: req.session.userName,
                        moment: moment,
                        problems: rows});
      }
  });
});

// GET ALL PROBLEMS FOR A SPECIFIC EMPLOYEE
// Restrict to Employees
app.all('/allReportedProblems', function(req, res, next) {
  conn.query(`SELECT problems.problem_id as problemId, 
              problems.name as problemName, 
              employee as employeeId, 
              employees.name as specialistName, 
              opened_on as dateOpened, 
              closed,
              solved,
              status 
              FROM employees, problems, problem_status, problem_status_relation 
              WHERE problem_status_relation.status_id = problem_status.status_id
              AND problems.problem_id = problem_status_relation.problem_id 
              AND employees.employee_id = assigned_to
              AND employee = ? 
              ORDER BY problems.problem_id ASC`, 
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
