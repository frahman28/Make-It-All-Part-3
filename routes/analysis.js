const express = require("express");
const router = express.Router();
const { verifySession, checkRoles } = require("./auth.middleware");
const {
  getClosedByProblemTypeCount,
  checkTwoDates,
  getClosedBySpecialistCount,
  getNumOfOpenProblems,
} = require("./analysis-functions");

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
    getNumOfOpenProblems().then((results) => {
      return res.json({ success: true, data: results });
    });
  }
);

module.exports = router;
