var conn = require("../dbconfig");

function getDateQuery(dateOne, dateTwo) {
  let dateQuery = "";
  // Assuming not to filter between two dates
  // If the dates were supplied in the parameters then change the query to have in the SQL
  if (dateOne !== undefined && dateTwo !== undefined) {
    // convert the dates to ISO string and remove the time aspect of the string for SQL to work with them
    dateQuery = `AND problems.closed_on >= '${dateOne.replaceAll(
      "/",
      "-"
    )}' AND problems.closed_on <= '${dateTwo.replaceAll("/", "-")}'`;
  }
  console.log("Date Query");
  console.log(dateOne, dateTwo);
  console.log(dateQuery);
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
    return false;
  } else {
    return true;
  }
}

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

var getNumOfOpenProblems = function () {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT COUNT(problem_type_id) AS numberOfOpenProblems FROM problems WHERE closed = 0",
      (err, results) => {
        if (err) throw err;
        resolve(results[0]);
      }
    );
  });
};

module.exports = {
  getClosedByProblemTypeCount,
  checkTwoDates,
  getClosedBySpecialistCount,
  getNumOfOpenProblems,
};
