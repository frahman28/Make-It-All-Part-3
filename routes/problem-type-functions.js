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
      parentProblemTypeId,
      (err, results) => {
        if (err) throw err;
        resolve(results);
      }
    );
  });
};

var getAssignedProblemTypes = function (specialistID) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT problem_types.problem_type FROM problem_types LEFT JOIN employee_problem_type_relation ON employee_problem_type_relation.problem_type_id = problem_types.problem_type_id WHERE employee_problem_type_relation.employee_id = ?",
      specialistID,
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
    SELECT employees.employee_id as specialistId, employees.name, COUNT(problems.problem_id) AS numberOfAssignedProblems
    FROM employees 
    LEFT JOIN employee_problem_type_relation ON employee_problem_type_relation.employee_id = employees.employee_id
    LEFT JOIN problems ON problems.assigned_to = employees.employee_id
    WHERE employees.role_id = 5 AND employees.available = 1 AND employee_problem_type_relation.problem_type_id = ${problemTypeID} 
    ${availableQuery}
    GROUP BY problems.assigned_to DESC;`;
    conn.query(sqlQuery, problemTypeID, (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

var getListOfSpecialistForProblemTypeExcluding = function (
  problemTypeID,
  specialistId
) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT employees.employee_id as specialistId, employees.name, COUNT(problems.problem_id) AS numberOfAssignedProblems
    FROM employees 
    LEFT JOIN employee_problem_type_relation ON employee_problem_type_relation.employee_id = employees.employee_id
    LEFT JOIN problems ON problems.assigned_to = employees.employee_id
    WHERE employees.role_id = 5 AND employee_problem_type_relation.problem_type_id = ${problemTypeID} 
    AND employees.employee_id <> ${specialistId}
    GROUP BY problems.assigned_to DESC;`;
    conn.query(sqlQuery, problemTypeID, (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

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
          reject(
            "Problem type could not be removed from specialist, either the problem type doesn't exist or you're not assigned to that problem type"
          );
        }
      }
    );
  });
};

var isAccountSpecialist = function (accountID) {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM employees WHERE role_id = 5 AND employee_id = ?",
      accountID,
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
          reject(err);
        }
      } else {
        resolve(results.insertId);
      }
    });
  });
};

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
        // if (results.length === 0 || results[0].child_of === null) {
        //   reject();
        // }
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

var createProblemTypeRelation = function (toInsert) {
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
            reject("Specialist already assigned to problem type");
          }
        } else {
          resolve();
        }
      }
    );
  });
};

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

module.exports = {
  getAllProblemTypes,
  getAllChildrenForPromblemType,
  getListOfSpecialistForProblemType,
  checkIfProblemTypeCanBeRemoved,
  removeProblemTypeRelationForSingleSpecialist,
  getListOfSpecialistForProblemTypeExcluding,
  isAccountSpecialist,
  problemTypeExists,
  createNewProblemType,
  unassignAllProblems,
  removeRelationToProblemType,
  getChildNodeID,
  reassignChildOf,
  createProblemTypeRelation,
  deleteProblemType,
  getAssignedProblemTypes,
};
