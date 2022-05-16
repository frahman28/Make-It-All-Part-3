var conn = require("../dbconfig");

var getAllRoles = function () {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM company_roles", (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

var getAllUsernames = function () {
  return new Promise((resolve, reject) => {
    conn.query("SELECT username FROM login_info", (err, results) => {
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
    conn.query(
      `SELECT employee_id AS specialistId, 
      problem_type as problemType 
      FROM problem_types 
      JOIN employee_problem_type_relation
    ON problem_types.problem_type_id = employee_problem_type_relation.problem_type_id;`,
      (err, results) => {
        if (err) throw err;
        resolve(results);
      }
    );
  });
};

var isIDInUse = function (employee_id) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT employee_id FROM employee WHERE employee_id = ?",
      employee_id,
      (err, results) => {
        if (err) throw err;
        resolve(results.length);
      }
    );
  });
};

module.exports = {
  getAllRoles,
  getAllDepartments,
  getJobTitles,
  getSpecialistsAndSpecialisations,
  getAllUsernames,
  isIDInUse,
};
