const express = require("express");
const router = express.Router();

var conn = require("../dbconfig");

router.get("/api", (req, res) => {
  // This API call will return the list of all problem types in the database
  conn.query("SELECT * FROM problem_types", (err, results) => {
    if (err) throw err;
    return res.json({ success: true, data: results });
  });
});

router.get("/api/children", (req, res) => {
  // This API call will return the list of children for a specific problem type,
  // the problem type is based on the request body supplied
  const { problemTypeID } = req.body;
  if (problemTypeID === undefined || !Number.isInteger(problemTypeID)) {
    return res.json({ success: false, msg: "Problem type id not supplied" });
  }
  conn.query(
    "SELECT * FROM problem_types WHERE child_of = ?",
    problemTypeID,
    (err, results) => {
      if (err) throw err;
      return res.json({ success: true, data: results });
    }
  );
});

router.get("/api/specialist", (req, res) => {
  // This API call will return a list of specialists who match to a problem type
  // this can be used to find specialists who specialize in a given problem type, useful for assigning problems to
  // the correct people
  const { problemTypeID, showOnlyAvailable } = req.body;
  // Check to see if the problem type id supplied is valid and was supplied
  if (problemTypeID === undefined || !Number.isInteger(problemTypeID)) {
    return res.json({ success: false, msg: "Problem type id not supplied" });
  }
  let availableQuery;
  if (showOnlyAvailable === true) {
    availableQuery = `AND employees.available = true`;
  } else {
    availableQuery = "";
  }
  const sqlQuery = `
  SELECT employees.employee_id, employees.name 
  FROM employees 
  LEFT JOIN employee_problem_type_relation ON employee_problem_type_relation.employee_id = employees.employee_id
  WHERE employees.role_id = 5 AND employee_problem_type_relation.problem_type_id = ? ${availableQuery};`;
  conn.query(sqlQuery, problemTypeID, (err, results) => {
    if (err) throw err;
    return res.json({ success: true, data: results });
  });
});

module.exports = router;
