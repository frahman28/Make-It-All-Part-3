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

module.exports = router;
