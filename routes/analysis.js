const express = require("express");
const router = express.Router();

var conn = require("../dbconfig");

async function getClosedByProblemTypeCount(dateOne, dateTwo) {
  let dateQuery = "";
  // Assuming not to filter between two dates
  // If the dates were supplied in the parameters then change the query to have in the SQL
  if (dateOne !== undefined && dateTwo !== undefined) {
    // convert the dates to ISO string and remove the time aspect of the string for SQL to work with them
    dateQuery = `AND problems.closed_on >= '${
      dateOne.toISOString().split("T")[0]
    }' AND problems.closed_on <= '${dateTwo.toISOString().split("T")[0]}'`;
  }
  // Create a promise to wait for the SQL to execute
  return new Promise((resolve, reject) => {
    // The SQL query will select the problem type, find how many problems exist that have been closed, between two
    // optional dates. Get the number of problems for each problem type
    conn.query(
      `
    SELECT problem_types.problem_type, COUNT(problem_types.problem_type) AS numberOfProblems 
    FROM problems 
    LEFT JOIN problem_types ON problem_types.problem_type_id = problems.problem_type_id 
    WHERE problems.closed = 1 ${dateQuery}
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

router.get("/api/problem-type", (req, res) => {
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
});

module.exports = router;
