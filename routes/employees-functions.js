var conn = require("../dbconfig");

var getAllRoles = function () {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM company_roles", (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

var getAllDepartments = function () {
    return new Promise((resolve, reject) => {
      conn.query("SELECT * FROM departments", (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  };


  var getJobTitles = function () {
    return new Promise((resolve, reject) => {
      conn.query("SELECT * FROM job_title", (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  };

  var getSpecialistsAndSpecialisations = function () {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT employee_id AS specialistId, 
      problem_type as problemType 
      FROM problem_types 
      JOIN employee_problem_type_relation
    ON problem_types.problem_type_id = employee_problem_type_relation.problem_type_id;`, 
    (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  };

  module.exports = {
    getAllRoles, getAllDepartments, getJobTitles, getSpecialistsAndSpecialisations
  };