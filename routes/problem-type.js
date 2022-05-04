const express = require("express");
const router = express.Router();
const { verifySession, checkRoles } = require("./auth.middleware");

var conn = require("../dbconfig");

var getAllProblemTypes = function () {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM problem_types", (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

var getAllChildrenForPromblemType = function (parentProblemTypeId) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM problem_types WHERE child_of = ?",
      problemTypeID,
      (err, results) => {
        if (err) throw err;
        resolve(results);
      }
    );
  });
};

var getListOfSpecialistForProblemType = function (
  problemTypeID,
  showOnlyAvailable
) {
  return new Promise((resolve, reject) => {
    let availableQuery;
    // If the query should only show the specialists who are available or not
    if (showOnlyAvailable === true) {
      availableQuery = `AND employees.available = true`;
    } else {
      availableQuery = "";
    }
    const sqlQuery = `
    SELECT employees.employee_id, employees.name, COUNT(problems.problem_id) AS numberOfAssignedProblems
    FROM employees 
    LEFT JOIN employee_problem_type_relation ON employee_problem_type_relation.employee_id = employees.employee_id
    LEFT JOIN problems ON problems.assigned_to = employees.employee_id
    WHERE employees.role_id = 5 AND employee_problem_type_relation.problem_type_id = ? ${availableQuery}
    GROUP BY problems.assigned_to;`;
    conn.query(sqlQuery, problemTypeID, (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

router.get("/api", verifySession, (req, res) => {
  // This API call will return the list of all problem types in the database
  getAllProblemTypes().then((results) => {
    return res.json({ success: true, data: results });
  });
});

router.get("/api/children", checkRoles("specialist", "admin"), (req, res) => {
  // This API call will return the list of children for a specific problem type,
  // the problem type is based on the request body supplied
  const { problemTypeID } = req.body;
  if (problemTypeID === undefined || !Number.isInteger(problemTypeID)) {
    return res.json({ success: false, msg: "Problem type id not supplied" });
  }
  getAllChildrenForPromblemType(problemTypeID).then((results) => {
    return res.json({ success: true, data: results });
  });
});

router.get("/api/specialist", verifySession, (req, res) => {
  // This API call will return a list of specialists who match to a problem type
  // this can be used to find specialists who specialize in a given problem type, useful for assigning problems to
  // the correct people
  const { problemTypeID, showOnlyAvailable } = req.body;
  // Check to see if the problem type id supplied is valid and was supplied
  if (problemTypeID === undefined || !Number.isInteger(problemTypeID)) {
    return res.json({ success: false, msg: "Problem type id not supplied" });
  }
  getListOfSpecialistForProblemType(problemTypeID, showOnlyAvailable).then(
    (results) => {
      return res.json({ success: true, data: results });
    }
  );
});

var checkIfProblemTypeCanBeRemoved = function (problemTypeID, specialistID) {
  return new Promise((resolve, reject) => {
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
          // We now check to see if the problem id supplied matches the specialists only key problem type
          if (intersection[0] === problemTypeID) {
            // The problem type they're trying to delete is the specialists only key problem type so this is not allowed
            reject(
              "Problem type cannot be removed, as it is a key problem type, and only one key problem type remains on the user"
            );
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      }
    );
  });
};

var removeProblemTypeRelationForSingleSpecialist = function (
  problemTypeID,
  specialistID
) {
  return new Promise((resolve, reject) => {
    conn.query(
      "DELETE FROM employee_problem_type_relation WHERE employee_id = ? AND problem_type_id = ?",
      [specialistID, problemTypeID],
      (err, results) => {
        if (err) throw err;
        // If there was an affected row then the relation was succesfully deleted
        if (results.affectedRows > 0) {
          resolve();
          // "Problem type no longer assigned to specialist",
        } else {
          // Otherwise the relation couldn't be deleted
          // Most likely because the specialist isn't assigned to that problem type
          // or the problem type doesn't exist
          reject("Problem type could not be removed from specialist");
        }
      }
    );
  });
};

router.delete(
  "/api/specialist/:specialist_id",
  checkRoles("specialist", "admin"),
  (req, res) => {
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
    checkIfProblemTypeCanBeRemoved(problemTypeID, specialistID)
      .then(() => {
        removeProblemTypeRelationForSingleSpecialist(
          problemTypeID,
          specialistID
        )
          .then(() => {
            return res.json({
              success: true,
              msg: "Problem type no longer assigned to specialist",
            });
          })
          .catch((errorMsg) => {
            return res.json({
              success: false,
              msg: errorMsg,
            });
          });
      })
      .catch((errorMsg) => {
        return res.json({
          success: false,
          msg: errorMsg,
        });
      });
  }
);

var isAccountSpecialist = function (accountID) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM employees WHERE role_id = 5 AND employee_id = ?",
      specialistID,
      (err, results) => {
        if (err) throw err;
        // If the length of the results is 0 then the employee is not a specialist
        if (results.length === 0) {
          reject("Employee is not a specialist or does not exist");
        } else {
          resolve();
        }
      }
    );
  });
};

var problemTypeExists = function (problemTypeID) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM problem_types WHERE problem_type_id = ?",
      problemTypeID,
      (err, results) => {
        if (err) throw err;
        // If the length of the results is 0 then the problem type does not exist
        if (results.length === 0) {
          reject("Problem type does not exist");
        } else {
          resolve();
        }
      }
    );
  });
};

var createProblemTypeRelation = function (specialistID, problemTypeID) {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO employee_problem_type_relation SET ?`,
      toInsert,
      (err, results) => {
        if (err) {
          // An error code of 1062 means the row attempting to insert already exists
          // So this way we catch the error and can handle it specifically, which involves
          // sending a json message back
          if (err.errno !== 1062) {
            throw err;
          } else {
            reject("Relation already exists");
          }
        }
        resolve();
      }
    );
  });
};

router.post(
  "/api/specialist/:specialist_id",
  checkRoles("specialist", "admin"),
  (req, res) => {
    // This API will add a specialist to a problem type
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
    // We need to check that the employee ID is specialist
    // We need to check the problemTypeID exists
    // We can then add the relation between the two
    isAccountSpecialist(specialistID)
      .then(
        // Check if the problem type exists
        problemTypeExists(problemTypeID)
          .then(() => {
            // Now the checks have passed we insert the relation between the employee and the problem type
            const toInsert = {
              problem_type_id: problemTypeID,
              employee_id: specialistID,
            };
            createProblemTypeRelation(specialistID, problemTypeID)
              .then(() => {
                return res.json({
                  success: true,
                  msg: "Specialist is now assigned to the problem type",
                });
              })
              .catch((errorMsg) => {
                return res.json({
                  success: false,
                  msg: errorMsg,
                });
              });
          })
          .catch((errorMsg) => {
            return res.json({
              success: false,
              msg: errorMsg,
            });
          })
      )
      .catch((errorMsg) => {
        return res.json({
          success: false,
          msg: errorMsg,
        });
      });
  }
);

var createNewProblemType = function (problemTypeName, problemTypeChildID) {
  return new Promise((resolve, reject) => {
    const toInsert = {
      problem_type: problemTypeName,
      child_of: problemTypeChildID,
    };
    conn.query("INSERT INTO problem_types SET ?", toInsert, (err, results) => {
      if (err) {
        // This can be used to check if the problem type that was attempted to be added already exists
        if (err.errno === 1062) {
          reject("Problem type already exists");
        } else if (err.errno === 1452) {
          // An error of 1452 means the foreign key check failed, so the child problem type trying to be added
          // is not referencing a problem type
          reject("Child problem type does not reference a problem type");
        } else {
          throw err;
        }
      }
      resolve(results.insertId);
      return res.json({
        success: true,
        msg: `Problem type has been created, ID is ${results.insertId}`,
      });
    });
  });
};

router.post("/api", checkRoles("specialist", "admin"), (req, res) => {
  // This API will create a new problem type
  const { problemTypeName, problemTypeChild } = req.body;
  // Check the problem type id and specialist id were defined, and the problem type id supplied is not a number
  if (problemTypeName === undefined && problemTypeChild === undefined) {
    return res.json({ success: false, msg: "Problem type name not specified" });
  }
  if (!Number.isInteger(problemTypeChild)) {
    return res.json({ success: false, msg: "Invalid child problem type" });
  }
  createNewProblemType(problemTypeName, problemTypeChild)
    .then((newProblemTypeID) => {
      return res.json({
        success: true,
        msg: `Problem type has been created, ID is ${newProblemTypeID}`,
      });
    })
    .catch((errorMsg) => {
      return res.json({
        success: false,
        msg: errorMsg,
      });
    });
});

async function unassignAllProblems(problemTypeID) {
  // This function will return a promise if all the problems that have the given problem id are set to null
  // It will reject the promise if there's an error
  return new Promise((resolve, reject) => {
    const updateTo = {
      problem_type_id: null,
    };
    // We update all the problem types to null where the problem type of the problem type intending to be deleted exists
    // This is for foreign key constraints
    conn.query(
      "UPDATE problems SET ? WHERE problem_type_id = ?",
      [updateTo, problemTypeID],
      (err) => {
        if (err) throw reject(err);
        resolve();
      }
    );
  });
}

async function removeRelationToProblemType(problemTypeID) {
  // This function will remove all relations a specialist might have to the problem type
  return new Promise((resolve, reject) => {
    // Delete from the database any row that has the problem type id of the one intending to be deleted
    conn.query(
      "DELETE FROM employee_problem_type_relation WHERE problem_type_id = ?",
      problemTypeID,
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

async function getChildNodeID(problemTypeID) {
  // This function will return a promise if the parent node is found of the node intending to be deleted
  // Otherwise it will be rejected
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT child_of FROM problem_types WHERE problem_type_id = ?",
      problemTypeID,
      (err, results) => {
        if (err) throw err;
        // If there are no results or if the result is null then it is rejected
        if (results.length === 0 || results[0].child_of === null) {
          reject();
        }
        resolve(results);
      }
    );
  });
}

async function reassignChildOf(problemTypeID, newParentID) {
  // This function will reassign the children of a problem type
  // It will set the child_of to the new parent of that problem type
  return new Promise((resolve, reject) => {
    conn.query(
      "UPDATE problem_types SET child_of = ? WHERE child_of = ?",
      [newParentID, problemTypeID],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

async function deleteProblemType(problemTypeID) {
  // This function will delete the problem type from the database
  return new Promise((resolve, reject) => {
    conn.query(
      "DELETE FROM problem_types WHERE problem_type_id = ?",
      problemTypeID,
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

router.delete(
  "/api/:problem_type_id",
  checkRoles("specialist", "admin"),
  (req, res) => {
    // Get the problem type id from the parameters
    const problemTypeIDString = req.params.problem_type_id;
    // If the problem type is undefined then return an error message
    if (problemTypeIDString === undefined) {
      return res.json({ success: false, msg: "Problem type ID not defined" });
    }
    // Convert the problem type id to a number, and check it can be a number
    const problemTypeID = Number.parseInt(problemTypeIDString);
    if (isNaN(problemTypeID)) {
      return res.json({ success: false, msg: "Problem type given incorrect" });
    }
    // Check if the problem type is a key problem type, in this case it shouldn't be deleted
    if ([1, 2, 3].includes(problemTypeID)) {
      return res.json({
        success: false,
        msg: "Problem type is a key problem type and cannot be removed",
      });
    }
    // First unassign all the problems that have the problem type
    unassignAllProblems(problemTypeID)
      .then(() => {
        // Once this has been done, then remove all specialist relations to that problem
        // type
        removeRelationToProblemType(problemTypeID)
          .then(() => {
            // Once that is done then get the parent problem type of the problem type to delete
            getChildNodeID(problemTypeID)
              .then((newParentNode) => {
                const newParentNodeID = newParentNode[0].child_of;
                // Reassign all the children of the problem type to the parent problem type of the one
                // to delete
                reassignChildOf(problemTypeID, newParentNodeID)
                  .then(() => {
                    // Can now finally delete the problem type
                    deleteProblemType(problemTypeID)
                      .then(() => {
                        // Return a succesful message
                        return res.json({
                          success: true,
                          msg: "Problem type succesfully removed",
                        });
                      })
                      .catch((err) => {
                        throw err;
                      });
                  })
                  .catch((err) => {
                    throw err;
                  });
              })
              .catch(() => {
                // If the parent problem type doesn't exist or the problem type doesn't exist
                // then return an error message
                return res.json({
                  success: false,
                  msg: "Error occured finding parent problem type or problem type does not exist",
                });
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }
);

module.exports = router;
