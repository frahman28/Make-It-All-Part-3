var conn = require("../dbconfig");
var moment  = require('moment');

var getAllProblems = function () {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM problems", (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

var getAllProblemNotes = function () {
  return new Promise((resolve, reject) => {
      conn.query(`
      SELECT 
        problem_id as problemId, 
        name, 
        comment 
      FROM comments
      JOIN employees 
        ON author = employee_id
      WHERE comment_id NOT IN
        (SELECT comment_id from solutions);`,
      (err, results) => {
          if (err) throw err;
          resolve(results);
      });
  });
};

var setProblemSolutionDate = function (problemId, closedOn) {
  return new Promise((resolve, reject) => {
      conn.query(`
      UPDATE problems 
      SET closed_on = "${closedOn}"
      WHERE problem_id = ${problemId};`,
      (err, results) => {
          if (err) throw err;
          resolve(results);
      });
  });
};

var getEmployeeName = function (employeeId) {
  return new Promise((resolve, reject) => {
      conn.query(`
      SELECT name
      FROM employees 
      WHERE employee_id = ${employeeId};`,
      (err, results) => {
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
                    problems.problem_type_id as problemTypeId, 
                    problem_type as problemType, 
                    software.name as softwareName, 
                    hardware.name as hardwareName, 
                    os.name as OSName, 
                    serial, 
                    license,
                    solved,
                    employee as reportedBy,
                    assigned_to as assignedSpecialist,
                    last_reviewed_by as lastReviewedBy
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

var reassignSpecialist = function (problemId, assignedSpecialist) {
  return new Promise((resolve, reject) => {
      conn.query(`
      UPDATE problems
      SET assigned_to = ${assignedSpecialist}
      WHERE problem_id = ${problemId};`,
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

var getAllSpecialists = function (problemId, reviewedBy) {
    return new Promise((resolve, reject) => {
        conn.query(`
        SELECT 
          employees.employee_id as specialistId,
          employees.name as specialistName, 
          COUNT(problems.problem_id) AS numberOfAssignedProblems 
        FROM employees 
        LEFT JOIN employee_problem_type_relation 
          ON employee_problem_type_relation.employee_id = employees.employee_id 
        LEFT JOIN problems 
          ON problems.assigned_to = employees.employee_id 
        WHERE employees.role_id = 5 
        GROUP BY problems.assigned_to DESC;`,
        (err, results) => {
            if (err) throw err;
            resolve(results);
        });
    });
};

var createProblemStatus = function (problemId) {
  return new Promise((resolve, reject) => {
      conn.query(`
      INSERT INTO problem_status_relation (problem_id, status_id)
      VALUES (${problemId}, 1);`,
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

var setProblemClosed = function (problemId, isClosed) {
  var query = "";
  if (isClosed) {
    var closedOn = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    query = `, closed_on = ${conn.escape(closedOn)}`;
  }
  return new Promise((resolve, reject) => {
      conn.query(`
      UPDATE problems
      SET solved = 1, closed = 1 ${query}
      WHERE problem_id = ${problemId};`,
      (err, results) => {
          if (err) throw err;
          resolve(results);
      });
  });
};

var setProblemSolved = function (problemId, solved) {
  return new Promise((resolve, reject) => {
      conn.query(`
      UPDATE problems
      SET solved = ${solved}, closed = 0
      WHERE problem_id = ${problemId};`,
      (err, results) => {
          if (err) throw err;
          resolve(results);
      });
  });
};

var createProblem = function (problemName, 
    problemDescription,  problemType, software, 
    hardware, license, serial, employee, assignedTo, 
    openedOn, os) {
    return new Promise((resolve, reject) => {
      conn.query(`
      INSERT INTO problems (name, problem_description, problem_type_id,
                          software_id, hardware_id, license, serial,
                          employee, assigned_to, opened_on, os_id)
      VALUES ("${problemName}", "${problemDescription}", ${problemType},
              ${software}, ${hardware}, "${license}", "${serial}", ${employee}, 
              ${assignedTo}, ${conn.escape(openedOn)}, ${os});`,
      (err, results) => {
        if (err) throw err;
        console.log(results);
        resolve(results);
      });
    });
  };

  var updateProblemLastViewedBy = function (problemId, lastReviewedBy) {
    return new Promise((resolve, reject) => {
      conn.query(`
      UPDATE problems
      SET last_reviewed_by = ${lastReviewedBy}
      WHERE problem_id = ${problemId}`,
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
    reassignSpecialist,
    updateViewed,
    setProblemClosed,
    setProblemSolved,
    getAllSpecialists,
    createProblemStatus,
    updateProblemStatus,
    setProblemSolutionDate,
    updateProblemLastViewedBy,
    getAllProblemNotes,
    createProblem,
    getEmployeeName
  };