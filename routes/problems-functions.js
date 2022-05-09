var conn = require("../dbconfig");

var getAllProblems = function () {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM problems", (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

var getProblemById = function (problemId) {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT problem_id, 
                    problems.name as problemName, 
                    problem_description as problemDescription, 
                    problem_type as problemType, 
                    software.name as softwareName, 
                    hardware.name as hardwareName, 
                    os.name as OSName, 
                    serial, 
                    license,
                    employee as reportedBy,
                    assigned_to as assignedSpecialist
                  FROM problems 
                  LEFT JOIN software
                    ON problems.software_id = software.software_id 
                  LEFT JOIN hardware 
                    ON hardware.hardware_id = problems.hardware_id 
                  LEFT JOIN os 
                    ON os.os_id = problems.os_id 
                  LEFT JOIN problem_types 
                    ON problem_types.problem_type_id = problems.problem_type_id 
                  WHERE problems.problem_id = ${problemId};`,
      (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  };

var deleteProblemById = function (problemId) {
    return new Promise((resolve, reject) => {
      conn.query("SELECT * FROM problems WHERE problem_id = ?",
      problemId,
      (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  };

var updateProblem = function (problemId) {
    return new Promise((resolve, reject) => {
      conn.query("PUT * FROM problems WHERE problem_id = ?",
      problemId,
      (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  };

var updateViewed = function (problemId, reviewedBy) {
    return new Promise((resolve, reject) => {
        conn.query(`
        UPDATE problems
        SET last_reviewed_by = ${reviewedBy}
        WHERE problem_id = ${problemId};`,
        (err, results) => {
            if (err) throw err;
            resolve(results);
        });
    });
};

var updateProblemStatus = function (problemId, statusId) {
    return new Promise((resolve, reject) => {
        conn.query(`
        UPDATE problem_status_relation
        SET status_id = ${statusId}
        WHERE problem_id = ${problemId};`,
        (err, results) => {
            if (err) throw err;
            resolve(results);
        });
    });
};


var createProblem = function (name, 
    problem_description,  problem_type_id, software_id, 
    hardware_id, software_id, licenses, 
    serial, employee, opened_on, os_id) {
    return new Promise((resolve, reject) => {
      conn.query(`
      INSERT INTO ()
      VALUES ()`,
      problemId,
      (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  };

  module.exports = {
    getAllProblems,
    getProblemById,
    deleteProblemById,
    updateProblem,
    updateViewed,
    updateProblemStatus,
    createProblem,
  };