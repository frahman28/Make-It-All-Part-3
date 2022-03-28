const express = require("express");
const { json } = require("express/lib/response");
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
          return res.json({ success: false, data: null });
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
  let toUpdateWith = {};
  if (name !== undefined) {
    toUpdateWith.name = name;
  }
  if (extension !== undefined) {
    toUpdateWith.extension = extension;
  }
  if (external !== undefined) {
    if (Number.isInteger(external)) {
      toUpdateWith.external = external;
    }
  }
  if (available !== undefined) {
    if (Number.isInteger(available)) {
      toUpdateWith.available = available;
    }
  }
  if (Object.keys(toUpdateWith).length > 0) {
    conn.query(
      "UPDATE employees SET ? WHERE employee_id = ?",
      [toUpdateWith, employeeID],
      function (err, results) {
        if (err) throw err;
        if (results.affectedRows > 0) {
          return res.json({ success: true, msg: "Employee updated" });
        } else {
          return res.json({ success: false, msg: "Employee not found" });
        }
      }
    );
  } else {
    res.json({ success: false, msg: "Invalid request" });
  }
});

// router.delete("/api/:employee_id", (req, res) => {
//   const employeeID = req.params.employee_id;
//   if (employeeID) {
//     conn.query(
//       "DELETE FROM employees WHERE employee_id = ?",
//       employeeID,
//       function (err) {
//         if (err) throw err;
//         return res.json({ success: true, msg: "Employee deleted" });
//       }
//     );
//   }
// });

router.put("/api/:employee_id/role", (req, res) => {
  const employeeID = req.params.employee_id;
  const roleID = req.body.role_id;
  if (roleID === undefined) {
    return res.json({ success: false, msg: "Invalid request" });
  }
  toUpdateWith = {
    employee_id: employeeID,
    role_id: roleID,
  };
  conn.query(
    "SELECT * FROM company_roles WHERE role_id = ?",
    roleID,
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        conn.query(
          "UPDATE employees SET ? WHERE employee_id = ?",
          [toUpdateWith, toUpdateWith.employee_id],
          function (err, results) {
            if (err) throw err;
            if (results.affectedRows > 0) {
              return res.json({ success: true, msg: "Employee role updated" });
            } else {
              return res.json({
                success: false,
                msg: "Employee role update failed",
              });
            }
          }
        );
      } else {
        return res.json({ success: false, msg: "Role does not exist" });
      }
    }
  );
});

router.put("/api/:employee_id/department", (req, res) => {
  const employeeID = req.params.employee_id;
  const departmentID = req.body.department_id;
  if (departmentID === undefined) {
    return res.json({ success: false, msg: "Invalid request" });
  }
  toUpdateWith = {
    employee_id: employeeID,
    department_id: departmentID,
  };
  conn.query(
    "SELECT * FROM departments WHERE department_id = ?",
    departmentID,
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        conn.query(
          "UPDATE job_info SET ? WHERE employee_id = ?",
          [toUpdateWith, toUpdateWith.employee_id],
          function (err, results) {
            if (err) throw err;
            if (results.affectedRows > 0) {
              return res.json({
                success: true,
                msg: "Employee department updated",
              });
            } else {
              return res.json({
                success: false,
                msg: "Employee department update failed",
              });
            }
          }
        );
      } else {
        return res.json({ success: false, msg: "Department does not exist" });
      }
    }
  );
});

router.put("/api/:employee_id/title", (req, res) => {
  const employeeID = req.params.employee_id;
  const titleID = req.body.title_id;
  if (titleID === undefined) {
    return res.json({ success: false, msg: "Invalid request" });
  }
  toUpdateWith = {
    employee_id: employeeID,
    title_id: titleID,
  };
  conn.query(
    "SELECT * FROM job_title WHERE title_id = ?",
    titleID,
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        conn.query(
          "UPDATE job_info SET ? WHERE employee_id = ?",
          [toUpdateWith, toUpdateWith.employee_id],
          function (err, results) {
            if (err) throw err;
            if (results.affectedRows > 0) {
              return res.json({ success: true, msg: "Employee title updated" });
            } else {
              return res.json({
                success: false,
                msg: "Employee title update failed",
              });
            }
          }
        );
      } else {
        return res.json({ success: false, msg: "Title does not exist" });
      }
    }
  );
});

module.exports = router;
