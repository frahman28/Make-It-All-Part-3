const express = require("express");
const router = express.Router();

var conn = require("../dbconfig");

/* GET users listing. */
router.get("/dashboard", (req, res, next) => {
  res.send("respond with a resource");
});

const getSQLForJoinEmployee = (whereClause = "") => {
  const sql = `
  SELECT 
  employees.employee_id, employees.name, employees.extension, employees.external, employees.available, 
  departments.name AS "department_name", 
  job_title.title, 
  company_roles.role
  FROM employees 
  LEFT JOIN job_info ON employees.employee_id = job_info.employee_id#
  LEFT JOIN departments ON job_info.department_id = departments.department_id
  LEFT JOIN job_title ON job_info.title_id = job_title.title_id
  LEFT JOIN company_roles ON employees.role_id = company_roles.role_id
  ${whereClause};`;
  return sql;
};

router.get("/api", (req, res) => {
  conn.query(getSQLForJoinEmployee(), function (err, results) {
    if (err) throw err;
    return res.json({ success: true, data: results });
  });
});

router.get("/api/:employee_id", (req, res) => {
  const employeeID = req.params.employee_id;
  if (employeeID) {
    conn.query(
      getSQLForJoinEmployee("WHERE employees.employee_id = ?"),
      employeeID,
      function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
          return res.json({ success: true, data: results[0] });
        } else {
          return res.json({ success: true, data: null });
        }
      }
    );
  } else {
    return res.json({ success: false, msg: "Employee ID not set" });
  }
});

router.put("/api/:employee_id", (req, res) => {
  let { name, extension, external, available } = req.body;
  const employeeID = req.params.employee_id;
  conn.query(
    "SELECT * FROM employees WHERE employee_id = ?",
    employeeID,
    function (err, results) {
      console.log(name, extension, external, available);

      if (results.length < 1) {
        return res.json({ success: false, msg: "Employee not found" });
      }
      if (err) throw err;
      if (name === undefined) {
        name = results[0].name;
      }
      if (extension === undefined) {
        extension = results[0].extension;
      }
      if (external === undefined) {
        if (!Number.isInteger(available)) {
          external = results[0].external;
        }
      }
      if (available === undefined) {
        if (!Number.isInteger(available)) {
          available = results[0].available;
        }
      }
      const toUpdateWith = {
        employee_id: employeeID,
        name: name,
        extension: extension,
        external: external,
        available: available,
      };
      conn.query(
        "UPDATE employees SET ? WHERE employee_id = ?",
        [toUpdateWith, toUpdateWith.employee_id],
        function (err, results) {
          if (err) throw err;
          return res.json({ success: true, msg: "Employee updated" });
        }
      );
    }
  );
});

router.delete("/api/:employee_id", (req, res) => {
  const employeeID = req.params.employee_id;
  if (employeeID) {
    conn.query(
      "DELETE FROM employees WHERE employee_id = ?",
      employeeID,
      function (err) {
        if (err) throw err;
        return res.json({ success: false, msg: "Employee deleted" });
      }
    );
  }
});

module.exports = router;
