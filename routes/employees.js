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

router.get("/api/edit/:employee_id", (req, res) => {
  if (req.params.employee_id) {
    conn.query(
      "SELECT * FROM employees WHERE employee_id = ?",
      req.params.employee_id,
      function (err, results) {
        if (err) throw err;
        res.send(results);
      }
    );
  } else {
    res.send([]);
  }
});

router.put("/api/update/:employee_id", (req, res) => {
  const toUpdateWith = {
    employee_id: req.params.employee_id,
    name: req.body.name,
    role_id: req.body.role_id,
    extension: req.body.extension,
    external: req.body.external,
    available: req.body.available,
  };
  conn.query(
    "UPDATE employees SET ? WHERE employee_id = ?",
    [toUpdateWith, toUpdateWith.employee_id],
    function (err, results) {
      if (err) throw err;
      res.send("Updated");
    }
  );
});

router.delete("/api/:id", (req, res) => {
  if (req.params.id) {
    conn.query(
      "DELETE FROM employees WHERE employee_id = ?",
      req.params.id,
      function (err) {
        if (err) throw err;
        res.send("Deleted");
      }
    );
  }
});

module.exports = router;
