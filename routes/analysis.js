const express = require("express");
const router = express.Router();
const { verifySession, checkRoles } = require("./auth.middleware");

var conn = require("../dbconfig");

function getDateQuery(dateOne, dateTwo) {
  let dateQuery = "";
  // Assuming not to filter between two dates
  // If the dates were supplied in the parameters then change the query to have in the SQL
  if (dateOne !== undefined && dateTwo !== undefined) {
    // convert the dates to ISO string and remove the time aspect of the string for SQL to work with them
    dateQuery = `AND problems.closed_on >= '${
      dateOne.toISOString().split("T")[0]
    }' AND problems.closed_on <= '${dateTwo.toISOString().split("T")[0]}'`;
  }
  return dateQuery;
}

async function getClosedByProblemTypeCount(dateOne, dateTwo) {
  const dateQuery = getDateQuery(dateOne, dateTwo);
  // Create a promise to wait for the SQL to execute
  return new Promise((resolve, reject) => {
    // The SQL query will select the problem type, find how many problems exist that have been closed, between two
    // optional dates. Get the number of problems for each problem type
    conn.query(
      `
    SELECT problem_types.problem_type, COUNT(problem_types.problem_type)AS numberOfProblems, ROUND(AVG(DATEDIFF(problems.closed_on, problems.opened_on)),0) AS averageDaysToClose
    FROM problems 
    LEFT JOIN problem_types ON problem_types.problem_type_id = problems.problem_type_id 
    WHERE problems.closed = 1 AND problems.problem_type_id is NOT NULL ${dateQuery}
    GROUP BY problems.problem_type_id;`,
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      }
    );
  });
}

function checkTwoDates(dateOne, dateTwo) {
  // This function will check if two dates supplied as strings
  // can be converted ot dates, if they can't be then the dates are ignored and undefined is returned
  // else two date objects are returned
  if (isNaN(Date.parse(dateOne)) || isNaN(Date.parse(dateTwo))) {
    return [undefined, undefined];
  }
  console.log("r");
  return [new Date(dateOne), new Date(dateTwo)];
}

router.get(
  "/api/problem-type",
  checkRoles("advisor", "admin", "specialist"),
  (req, res) => {
    // Dates should be in the format mm/dd/yyyy or something similar
    // An array of dates after being converted to date objects, or undefined
    const dates = checkTwoDates(req.body.startDate, req.body.endDate);
    // Execute the sql query to get the number of problems, between two dates and group them by the number of problems
    // each problem type has, to see what problem types are causing the most problems
    getClosedByProblemTypeCount(dates[0], dates[1])
      .then((results) => {
        // If the query is succesful then return the results
        return res.json({ success: true, data: results });
      })
      .catch((err) => {
        // Else throw an error
        throw err;
      });
  }
);

async function getClosedBySpecialistCount(dateOne, dateTwo) {
  const dateQuery = getDateQuery(dateOne, dateTwo);
  // Create a promise to wait for the SQL to execute
  return new Promise((resolve, reject) => {
    // The SQL query will get the number of problems a specialist has solved when they were assigned to that problem
    conn.query(
      `
      SELECT employees.employee_id, employees.name, COUNT(problems.problem_id) AS numberOfProblems, ROUND(AVG(DATEDIFF(problems.closed_on, problems.opened_on)),0) AS averageDaysToClose 
      FROM problems 
      LEFT JOIN employees ON problems.assigned_to = employees.employee_id 
      WHERE problems.closed = 1 AND problems.assigned_to is NOT NULL ${dateQuery}
      GROUP BY problems.assigned_to;
      `,
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      }
    );
  });
}

router.get(
  "/api/specialist",
  checkRoles("advisor", "admin", "specialist"),
  (req, res) => {
    // This API will get the number of problems each specialist has closed, assuming they've closed a problem
    const dates = checkTwoDates(req.body.startDate, req.body.endDate);
    getClosedBySpecialistCount(dates[0], dates[1])
      .then((results) => {
        // If the query is succesful then return the results
        return res.json({ success: true, data: results });
      })
      .catch((err) => {
        // Else throw an error
        throw err;
      });
  }
);

router.get(
  "/api/open-problems",
  checkRoles("advisor", "admin", "specialist"),
  (req, res) => {
    // Use SQL to count the number of open problems in the database and return this is as a json response
    conn.query(
      "SELECT COUNT(problem_type_id) AS numberOfOpenProblems FROM problems WHERE closed = 0",
      (err, results) => {
        if (err) throw err;
        return res.json({ success: true, data: results[0] });
      }
    );
  }
);

module.exports = router;
