const express = require("express");
const router = express.Router();
const { verifySession, checkRoles } = require("./auth.middleware");
const {
  getAllProblemTypes,
  getAllChildrenForPromblemType,
  getListOfSpecialistForProblemType,
  checkIfProblemTypeCanBeRemoved,
  removeProblemTypeRelationForSingleSpecialist,
  isAccountSpecialist,
  problemTypeExists,
  createNewProblemType,
  unassignAllProblems,
  removeRelationToProblemType,
  getChildNodeID,
  reassignChildOf,
  createProblemTypeRelation,
  deleteProblemType,
} = require("./problem-type-functions");

router.get("/manage-problem-types", checkRoles("admin"), (req, res) => {
  res.render("editProblemTypes", {
    userName: req.session.userName,
    role: req.session.userRole,
  });
});

router.get("/api", verifySession, (req, res) => {
  // This API call will return the list of all problem types in the database
  getAllProblemTypes().then((results) => {
    return res.json({ success: true, data: results });
  });
});

router.get("/api/children", checkRoles("specialist", "admin"), (req, res) => {
  // This API call will return the list of children for a specific problem type,
  // the problem type is based on the request body supplied
  let { problemTypeID } = req.query;
  if (problemTypeID === undefined || isNaN(Number.parseInt(problemTypeID))) {
    return res.json({ success: false, msg: "Problem type id not supplied" });
  }
  console.log("Here");
  console.log(Number.parseInt(problemTypeID));
  problemTypeID = Number.parseInt(problemTypeID);
  getAllChildrenForPromblemType(problemTypeID).then((results) => {
    return res.json({ success: true, data: results });
  });
});

router.get("/api/specialist", verifySession, (req, res) => {
  // This API call will return a list of specialists who match to a problem type
  // this can be used to find specialists who specialize in a given problem type, useful for assigning problems to
  // the correct people
  console.log(req.query);
  let { problemTypeID, showOnlyAvailable } = req.query;
  // Check to see if the problem type id supplied is valid and was supplied
  if (problemTypeID === undefined || isNaN(Number.parseInt(problemTypeID))) {
    return res.json({ success: false, msg: "Problem type id not supplied" });
  }
  problemTypeID = Number.parseInt(problemTypeID);
  getListOfSpecialistForProblemType(problemTypeID, showOnlyAvailable).then(
    (results) => {
      return res.json({ success: true, data: results });
    }
  );
});

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

router.post(
  "/api/specialist/:specialist_id",
  checkRoles("specialist", "admin"),
  (req, res) => {
    // This API will add a specialist to a problem type
    // The parameter will take the specialist id
    // The body of the request will be the problem type id to remove the user from
    const { problemTypeID } = req.query;
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

router.post("/api", checkRoles("specialist", "admin"), (req, res) => {
  // This API will create a new problem type
  const { problemTypeName, problemTypeChild } = req.body;
  // Check the problem type id and specialist id were defined, and the problem type id supplied is not a number
  console.log(problemTypeName, problemTypeChild);
  if (problemTypeName === undefined && problemTypeChild === undefined) {
    return res.json({ success: false, msg: "Problem type name not specified" });
  }
  if (isNaN(Number.parseInt(problemTypeChild))) {
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
