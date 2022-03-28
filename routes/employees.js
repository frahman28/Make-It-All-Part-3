const express = require("express");
const router = express.Router();

var conn = require("../dbconfig");

/* GET users listing. */
router.get("/dashboard", (req, res, next) => {
  res.send("respond with a resource");
});

const getSQLForJoinEmployee = (whereClause = "") => {
  // This function is used to return the sql for joining the employee table
  // with other tables realted to employee information
  // the where clause is an optional where clause to specify a specific employee
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
  // This default /api will get all of the employees from the database
  conn.query(getSQLForJoinEmployee(), function (err, results) {
    if (err) throw err;
    return res.json({ success: true, data: results });
  });
});

router.get("/api/:employee_id", (req, res) => {
  // This api request will get a specific employee based their id from the database
  // The employee id is in the request parameter
  const employeeID = req.params.employee_id;
  // Check the employee id was supplied as a parameter
  if (employeeID) {
    // Attempt to get the employee that matches the employee id
    conn.query(
      getSQLForJoinEmployee("WHERE employees.employee_id = ?"),
      employeeID,
      function (err, results) {
        if (err) throw err;
        // Check if an employee was found in the database
        if (results.length > 0) {
          // Return the json of that employee
          return res.json({ success: true, data: results[0] });
        } else {
          // Return success as false as no employee could be found
          return res.json({ success: false, data: null });
        }
      }
    );
  } else {
    return res.json({ success: false, msg: "Employee ID not set" });
  }
});

router.put("/api/:employee_id", (req, res) => {
  // This api call is for updating an employees information
  // All updated fields are optional and do not have to be supplied
  // We look for the name, extension, external, available in the request body as these are what can be
  // updated for the employee
  let { name, extension, external, available } = req.body;
  const employeeID = req.params.employee_id;
  // Create a blank object to add the changed information about the employee to
  let toUpdateWith = {};
  // Check if undefined, if undefined then the information wasn't supplied in the request body
  if (name !== undefined) {
    // If not undefined then add it to the object for updating the database with
    toUpdateWith.name = name;
  }
  if (extension !== undefined) {
    toUpdateWith.extension = extension;
  }
  if (external !== undefined) {
    // These should be numbers supplied
    if (Number.isInteger(external)) {
      // Check the number supplied can be a boolean interpreted by the database
      if (external == 0 || external == 1) {
        toUpdateWith.external = external;
      }
    }
  }
  if (available !== undefined) {
    if (Number.isInteger(available)) {
      if (available == 0 || available == 1) {
        toUpdateWith.available = available;
      }
    }
  }
  // Check that the object to add has at least one piece of information to update the databaes with
  if (Object.keys(toUpdateWith).length > 0) {
    conn.query(
      "UPDATE employees SET ? WHERE employee_id = ?",
      [toUpdateWith, employeeID],
      function (err, results) {
        if (err) throw err;
        // If the affected rows is greater than 0 then the employee had its information updated
        if (results.affectedRows > 0) {
          return res.json({ success: true, msg: "Employee updated" });
        } else {
          // else no employee was updated, which means the employee couldn't be found
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
  // This api call is used for updating an employees role in the company
  const employeeID = req.params.employee_id;
  // The role is located in the body
  const roleID = req.body.role_id;
  // If the role couldn't be found in the body then we can't update the database with anything
  if (roleID === undefined) {
    return res.json({ success: false, msg: "Invalid request" });
  }
  toUpdateWith = {
    employee_id: employeeID,
    role_id: roleID,
  };
  // First check that a role exists with this new role id
  conn.query(
    "SELECT * FROM company_roles WHERE role_id = ?",
    roleID,
    (err, results) => {
      if (err) throw err;
      // Check the role exists with the role id being used to update with
      if (results.length > 0) {
        // Update the employee with the new role
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
  // Works similarly to the role api call, instead updates an employees department
  // But first checks the department exists in the database before updating
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
  // Works similarly to the role api call, instead updates an employees title
  // But first checks the title exists in the database before updating
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
