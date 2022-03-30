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

module.exports = router;
