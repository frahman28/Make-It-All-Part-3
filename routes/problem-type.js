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
  // If the query should only show the specialists who are available or not
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

router.delete("/api/specialist/:specialist_id", (req, res) => {
  // This API will remove problem types that a user is specialised in
  // The parameter will take the specialist id
  // The body of the request will be the problem type id to remove the user from
  const { problemTypeID } = req.body;
  const specialistID = req.params.specialist_id;
  // Check the problem type id and specialist id were defined, and the problem type id supplied is not a number
  if (
    problemTypeID === undefined ||
    specialistID === undefined ||
    !Number.isInteger(problemTypeID)
  ) {
    return res.json({ success: false, msg: "Invalid request" });
  }
  // Check if the problem type id is equal to that of Hardware, Network, Software
  // As these shouldn't be removed from the specialists
  conn.query(
    `SELECT problem_type_id
    FROM employee_problem_type_relation 
    WHERE employee_id = ?`,
    specialistID,
    (err, results) => {
      if (err) throw err;
      // Convert the array of objects as the result of sql into an array
      // With each value being a problem type the specialist specializes in
      const activeProblemTypes = results.map(
        ({ problem_type_id }) => problem_type_id
      );
      console.log(activeProblemTypes);
      // The list of key problem types in the database, each user should have one of these
      // Hardware, Software, Network
      const keyProblemTypes = [1, 2, 3];
      // This will create a new array which contains the matching elements from both of the two arrays above
      const intersection = keyProblemTypes.filter((problemType) =>
        activeProblemTypes.includes(problemType)
      );
      // If the intersection is equal to 1, then that specialist only specializes in 1 of the key problem types
      // Therefore we should check to see if this is the one they're attempting to remove
      // If the intersection length is greater than 1 then it's okay to delete a key problem type
      if (intersection.length === 1) {
        // We now check to see if the problem id supplied
        if (intersection[0] === problemTypeID) {
          // The problem type they're trying to delete is the specialists only key problem type so this is not allowed
          return res.json({
            success: false,
            msg: "Problem type cannot be removed, as it is a key problem type, and only one key problem type remains on the user",
          });
        }
      }
      conn.query(
        "DELETE FROM employee_problem_type_relation WHERE employee_id = ? AND problem_type_id = ?",
        [specialistID, problemTypeID],
        (err, results) => {
          if (err) throw err;
          // If there was an affected row then the relation was succesfully deleted
          if (results.affectedRows > 0) {
            return res.json({
              success: true,
              msg: "Problem type no longer assigned to specialist",
            });
          } else {
            // Otherwise the relation couldn't be deleted
            // Most likely because the specialist isn't assigned to that problem type
            // or the problem type doesn't exist
            return res.json({
              success: false,
              msg: "Problem type could not be removed from specialist",
            });
          }
        }
      );
    }
  );
});

module.exports = router;
