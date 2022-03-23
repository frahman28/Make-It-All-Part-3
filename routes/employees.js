const express = require("express");
const router = express.Router();

var conn = require("../dbconfig");

/* GET users listing. */
router.get("/dashboard", (req, res, next) => {
  res.send("respond with a resource");
});

router.get("/api/register", (req, res) => {
  conn.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

router.get("/api/edit", (req, res) => {
  console.log("TEST");
  if (req.query.employee_id) {
    conn.query(
      "SELECT * FROM employees WHERE employee_id = ?",
      req.query.employee_id,
      function (err, results) {
        if (err) throw err;
        res.send(results);
      }
    );
  } else {
    res.send([]);
  }
});

module.exports = router;
