// problems.js
// Has routes and endpoints that handle problems 
// retrieval from the problem table in  database.


var express = require('express');
var app     = express.Router();
var conn    = require('../dbconfig');
var moment  = require('moment');
var {verifySession, checkRoles} = require("../utils/auth.utils");
var software = require("../utils/software.utils");
var hardware = require("../utils/hardware.utils");
var os = require("../utils/os.utils");
var solutionUtils = require("../utils/solution.utils");
var problemTypes = require("../utils/problem-type.utils");
var problemUtils = require("../utils/problems.utils");
const e = require('connect-flash');

// route:  GET /
// access: ALL NOT LOGGED IN
// Navigates user to their dashboard, if they are logged in
// (session exists). Otherwise regirect to the login page
// and show error message.
app.get('/', function (req, res, next) {
    if (req.session.userId) {
        if (user.session.userRole == "specialist" || user.session.userRole == "employee") {
            res.redirect('/myProblems');
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.redirect("../login");
    } 
});


// route:  GET /myProblems
// access: ADMINS, ADVISERS
// Navigates users of role Admin or Adviser to their own
// dashboards.
app.get('/dashboard', checkRoles("admin", "adviser"), function (req, res, next) {
    res.render('dashboard', {userName: req.session.userName, role: req.session.userRole});
});


// route:  GET /myProblems
// access: SPECIALISTS, EMPLOYEES
// Navigates users of role Specialist or Employee to their own
// dashboards. Displays for each of them their assigned or reported problems,
// which have not been resolved.
app.get('/myProblems', checkRoles("specialist", "employee"), async function(req, res, next) {
    // Change query sytax depending on current user's role.
    let query  = req.session.userRole === 'specialist' ? 'assigned_to' : 'employee';
    let userId = req.session.userId;

    //Get all hardware, software, os, problem types to display in update tables as options
    var allSoftware = await software.getAllSoftware(req, res);
    var allHardware = await hardware.getAllHardware(req, res);
    var allOS = await os.getAllOS(req, res);
    var allProblemTypes = await problemTypes.getAllProblemTypes();

    // Retrieve details about user's open problems.
    conn.query(`SELECT problems.problem_id as problemId,
                    problems.name as problemName,
                    problems.problem_type_id as problemTypeId,
                    problems.software_id as problemSoftwareId,
                    problems.hardware_id as problemHardwareId,
                    employee as reportedById,
                    assigned_to as specialistId,
                    employees.name as reportedByName,
                    specialists.name as specialistName,
                    opened_on as dateOpened,
                    closed_on as dateClosed,
                    problems.os_id as problemOSId,
                    solved,
                    status
                FROM problems
                LEFT JOIN employees 
                    ON employees.employee_id = employee
                LEFT JOIN employees as specialists 
                    ON specialists.employee_id = assigned_to
                LEFT JOIN problem_status_relation 
                    ON problems.problem_id = problem_status_relation.problem_id 
                LEFT JOIN problem_status 
                    ON problem_status_relation.status_id = problem_status.status_id
                WHERE closed <> 1
                AND ${query} = ${userId}
                ORDER BY solved DESC, problems.problem_id ASC;`,  function (err, rows) {
        if (err){
            // If error occured, return an empty array.
            res.render('problems/my_problems', {userName: req.session.userName,     // displays user's username.
                                            moment: moment,                         // used for date formatting.
                                            problems: [],                           // empty array of problems.
                                            role: req.session.userRole,             // user role.
                                            hardware: [],                           // empty array of hardware.
                                            software: [],                           // empty array of software.
                                            os: [],                                 // empty array of os.    
                                            problemTypes: []});                     // empty array of problem types. 

        } else {
            // Otherwise return an array of problems..
            res.render('problems/my_problems', {userName: req.session.userName,     // displays user's username.
                                            moment: moment,                         // used for date formatting.
                                            problems: rows,                         // array of problems.
                                            role: req.session.userRole,             // used for dynamic rendering (decides which column should be displayed).
                                            hardware: allHardware,                  // array of hardware to display as options.
                                            software: allSoftware,                  // array of software to display as options.
                                            os: allOS,                              // array of os to display as options.    
                                            problemTypes: allProblemTypes});        // array of problem types to display as options.                                    
        }
    });
});


// route:  GET /allProblems
// access: SPECIALISTS, EMPLOYEES
// Navigates users of role Specialist or Employee to their own
// dashboards. Displays for each of them their assigned or reported problems,
// which have not been resolved.
app.all('/allProblems', verifySession, function (req, res, next) {
    // Retrieve details about user's open problems.
    conn.query(`SELECT problems.problem_id as problemId,
                    problems.name as problemName,
                    problem_description as problemDescription,
                    employee as reportedById,
                    employees.name as reportedByName,
                    specialists.name as specialistName,
                    opened_on as dateOpened,
                    closed_on as dateClosed,
                    status,
                    closed,
                    os.name as OS,
                    software.name as softwareName,
                    type_of_software.type as softwareType,
                    solut.comment as solution,
                    comments.comment as solutionNotes,
                    hardware.name as hardwareName,
                    type_of_hardware.type as hardwareType,
                    hardware_relation.serial as serialNumber
                FROM problems
                JOIN employees as specialists 
                    ON specialists.employee_id = assigned_to
                JOIN employees 
                    ON employees.employee_id = employee
                LEFT JOIN os 
                    ON os.os_id = problems.os_id
                LEFT JOIN hardware 
                    ON hardware.hardware_id = problems.hardware_id
                LEFT JOIN type_of_hardware 
                    ON type_of_hardware.type_id = hardware.type_id
                LEFT JOIN software 
                    ON software.software_id = problems.software_id
                LEFT JOIN type_of_software 
                    ON type_of_software.type_id = software.type_id
                LEFT JOIN hardware_relation 
                    ON hardware_relation.hardware_id = hardware.hardware_id
                LEFT JOIN problem_status_relation 
                    ON problems.problem_id = problem_status_relation.problem_id
                LEFT JOIN problem_status
                    ON problem_status_relation.status_id = problem_status.status_id
                LEFT JOIN solutions 
                    ON solutions.problem_id = problems.problem_id
                LEFT JOIN comments AS solut 
                    ON solut.comment_id = solutions.comment_id
                LEFT JOIN comments 
                    ON comments.problem_id = problems.problem_id 
                    AND comments.comment_id NOT IN (select comment_id FROM solutions)
                ORDER BY problems.problem_id ASC;`, function (err, rows) {
        if (err) {
        // If error occured, return an empty array.
            res.render('problems/all_problems', {userName: req.session.userName,     // displays user's username.
                                                moment: moment,                      // used for date formatting.
                                                problems: [],                        // empty array.
                                                role: req.session.userRole});        // user role.
        } else {
            res.render('problems/all_problems', {userName: req.session.userName,     // displays user's username.
                                                moment: moment,                      // used for date formatting.
                                                problems: rows,                      // array of problems.
                                                role: req.session.userRole});        // user role.
        }
    });
});

// route:  GET /submitProblem
// access: SPECIALISTS, EMPLOYEES
// Navigates users of role Specialist or Employee to problem submission page.
// Retrieves all information for the lookup tables.
app.get("/submitProblem", checkRoles("employee", "specialist"), async function (req, res, next) {
    var allSoftware = await software.getAllSoftware();
    var allHardware = await hardware.getAllHardware();
    var allOS = await os.getAllOS();
    var allSolutions = await solutionUtils.getAllSolutions();
    var allProblemTypes = await problemTypes.getAllProblemTypes();

    res.render('submitProblem', {userName: req.session.userName,
                                software: allSoftware,
                                hardware: allHardware,
                                os: allOS,
                                solution: allSolutions,
                                problemTypes: allProblemTypes,
                                role: req.session.userRole});
});


// route:  POST /submitProblem
// access: SPECIALISTS, EMPLOYEES
// Creates a new problem with information inputed by the user and matches it
// with a specialist.
app.post("/submitProblem", checkRoles("employee"), async function (req, res, next) {
    // Retrieves information from the submitted form.
    let problemName = req.body.problemName;
    let problemType = req.body.problemType;
    let operatingSystem = req.body.operatingSystem.length > 0 ? req.body.operatingSystem : null;
    let software = req.body.software.length > 0 ? req.body.software : null;
    let hardware = req.body.hardware.length > 0 ? req.body.hardware : null;
    let license = req.body.license.length > 0 ? req.body.license : null;
    let serialNumber = req.body.serialNumber.length > 0 ? req.body.serialNumber : null;
    let problemDesription = req.body.problemDesription;
    let solution = req.body.solution;
    let solutionNotes = req.body.solutionNotes;

    // Gets the date to set as open date.
    let openedOn = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    // If there's something wrong with the form, refresh the page.
    if (problemName.length < 1 || problemType.length < 1 || (software == null && hardware == null)) {
        return res.redirect("/submitProblem");
    }

    let assignedSpecialist;
    // Get all specialist of a specific specialisation.
    let specialistsForProblemType = await problemTypes.getListOfSpecialistForProblemType(problemType, true);

    try{
        if (specialistsForProblemType.length < 1) {
            // If there's no specialist for this specialisation, find a parent
            // of this specialisation.
            let problemParent = await problemTypes.getChildNodeID(problemType);
    
            if (problemParent.length > 0) {
                // If the problem type/specialisation is a children of some other
                // specialisation, assign a specialist of this parent specialisation
                // to this problem.
                let specialistsForProblemType = await problemTypes.getListOfSpecialistForProblemType(problemParent[0].child_of, true);
                asssignedSpecialist = specialistsForProblemType[0].specialistId;
    
            } else {
                // If there is no specialist of this specialisation, assign
                // a random specialist.
                let allSpecialists = await problemUtils.getAllSpecialists();            
                asssignedSpecialist = allSpecialists[0].specialistId;
            }
        } else {
            // If there exists a specialist for this specialisation,
            //  assign them to this problem.
            asssignedSpecialist = specialistsForProblemType[0].specialistId;
            console.log(asssignedSpecialist)
        }
    } catch (e) {
        // If an error occurs, assign a random specialist.
        console.log("ERROR")
        console.log(e)
        console.log("Assigned a random specialist.")

        let allSpecialists = await problemUtils.getAllSpecialists();            
        asssignedSpecialist = allSpecialists[0].specialistId;
    }

    // Create and save a new problem in the `problems` table.
    let newProblemId = await problemUtils.createProblem(problemName, problemDesription, problemType, 
        software, hardware, license,
        serialNumber, req.session.userId, asssignedSpecialist, 
        openedOn, operatingSystem);

    // Create and save a new relation between problem and its status.
    await problemUtils.createProblemStatus(newProblemId.insertId);

    if (solution.length > 0) {
        // If employee provided a solution for this problem, set the problem as solved and closed.
        await problemUtils.updateProblemStatus(newProblemId.insertId, 3);
        await problemUtils.setProblemClosed(newProblemId.insertId, openedOn);
        
        // And the solution to the database and link it with problem.
        let problemSolution = await solutionUtils.addComments(newProblemId.insertId, req.session.userId, solution);
        await solutionUtils.linkProblemToSolution(newProblemId.insertId, problemSolution.insertId);

        if (solutionNotes.length > 0) {
            // If extra notes were provided, save them as well.
            await solutionUtils.addComments(newProblemId.insertId, req.session.userId, solutionNotes);
        }
    }
    
    return res.redirect("/myProblems");
});


// route:  GET /submitProblem/:id
// access: SPECIALISTS, EMPLOYEES
// Creates a new problem with information inputed by the user and matches it
// with a specialist.
app.get("/submitProblem/:problemId", checkRoles("employee", "specialist"), async function (req, res, next) {
    // Check the id provided, and if faulty, return to the dashboard.
    let problemId = req.params["problemId"];
    if (isNaN(problemId)) return res.redirect("../myProblems");

    // Retreive details about the problem from the database.
    let problem = await problemUtils.getProblemById(problemId);

    // If problem not found, redirect to the dashboard.
    if (problem.length < 1) {
        return res.redirect("../myProblems");
    }

    // If the problem has not been reported by, or assigned to the user, prohibit entering the page.
    if (problem[0].reportedBy != req.session.userId && problem[0].assignedSpecialist != req.session.userId) {
        return res.sendStatus(401);
    }

    // Change problem status, to sygnalise, that the problem is currently being worked on.
    if (problem[0].lastReviewedBy != req.session.userId && req.session.userRole == "specialist") {
        await problemUtils.updateProblemLastViewedBy(problemId, req.session.userId);
        await problemUtils.updateProblemStatus(problemId, 2);
    }
    
    // If the employee is entering the page after receiving comments from the specialist,
    // retrieve the solution from the database.
    let problemSolution = undefined;
    if (problem[0].solved == 1) {
        problemSolution = await solutionUtils.getSolutionForProblemId(problemId);
    }

    // Get other information to show in the lookup tables.
    var allSoftware = await software.getAllSoftware();
    var allHardware = await hardware.getAllHardware();
    var allOS = await os.getAllOS();
    var allSolutions = await solutionUtils.getAllSolutions();
    var allProblemTypes = await problemTypes.getAllProblemTypes();

    return res.render('submitProblem', {userName: req.session.userName,
                                problem: problem,
                                software: allSoftware,
                                hardware: allHardware,
                                os: allOS,
                                solution: allSolutions,
                                problemSolution: problemSolution,
                                problemTypes: allProblemTypes,
                                role: req.session.userRole});
});


// route:  POST /submitProblem/:id
// access: SPECIALISTS, EMPLOYEES
// Creates a new problem with information inputed by the user and matches it
// with a specialist.
app.post("/submitProblem/:problemId", checkRoles("employee", "specialist"), async function (req, res, next) {
    let problemId = req.params["problemId"];
    let author = req.session.userId;
    let solution = req.body.solution;
    let solutionNotes = req.body.solutionNotes;

    if (solution.length < 1) return res.redirect("/submitProblem/" + problemId);
    
    let newSolution = await solutionUtils.addComments(problemId, author, solution);
    await solutionUtils.linkProblemToSolution(problemId, newSolution.insertId);

    if (solutionNotes.length > 0) {
        await solutionUtils.addComments(problemId, author, solutionNotes);
    }
    
    await problemUtils.updateProblemStatus(problemId, 3);
    await problemUtils.setProblemSolved(problemId, 1);

    return res.redirect('/myProblems');
});


// route:  GET /submitProblem/:id
// access: SPECIALISTS, EMPLOYEES
// Creates a new problem with information inputed by the user and matches it
// with a specialist.
app.get("/reassignProblem/:problemId", checkRoles("employee", "specialist"), async function (req, res, next) {
    // TODO
    let problemId = req.params["problemId"];
    if (isNaN(problemId)) return res.redirect("../myProblems");

    let problem = await problemUtils.getProblemById(problemId);

    if (problem.length < 1) {
        return res.redirect("../myProblems");
    }

    if (problem[0].reportedBy != req.session.userId) {
        // Prohibit enter.
        return res.sendStatus(401);
    }

    let asssignedSpecialist;
    let problemType = problem[0].problemTypeId;
    console.log("problemType, assignedSpecialist: ", problemType, problem[0].assignedSpecialist)

    let specialistsForProblemType = await problemTypes.getListOfSpecialistForProblemTypeExcluding(problemType, problem[0].assignedSpecialist);
    console.log("specialistsForProblemType: ", specialistsForProblemType)

    if (specialistsForProblemType.length < 1) {
        let problemParent = await problemTypes.getChildNodeID(problemType);
        if (problemParent.length < 1) {
            let allSpecialists = await problemUtils.getAllSpecialists();
            asssignedSpecialist = allSpecialists[0].specialistId;
        } else {
            let specialistsForProblemType = await problemTypes.getListOfSpecialistForProblemTypeExcluding(problemParent[0].child_of, problem[0].assignedSpecialist);
            if (specialistsForProblemType.length < 1) {
                let allSpecialists = await problemUtils.getAllSpecialists();
                asssignedSpecialist = allSpecialists[0].specialistId;
    
            } else {
                asssignedSpecialist = specialistsForProblemType[0].specialistId;
            }
        }
    } else {
        asssignedSpecialist = specialistsForProblemType[0].specialistId;
    }

    await problemUtils.reassignSpecialist(problemId, asssignedSpecialist);
    await problemUtils.updateProblemStatus(problemId, 1);
    await problemUtils.setProblemSolved(problemId, 0);

    return res.redirect('../myProblems');
});

// route:  GET /submitProblem/:id
// access: SPECIALISTS, EMPLOYEES
// Creates a new problem with information inputed by the user and matches it
// with a specialist.
app.get("/resolveProblem/:problemId", checkRoles("employee", "specialist"), async function (req, res, next) {
    // TODO
    let problemId = req.params["problemId"];
    if (isNaN(problemId)) return res.redirect("../myProblems");

    let problem = await problemUtils.getProblemById(problemId);

    if (problem.length < 1) {
        return res.redirect("../myProblems");
    }

    if (problem[0].reportedBy != req.session.userId) {
        // Prohibit enter.
        return res.sendStatus(401);
    }
    console.log("PROBLEM ", problemId, " RESOLVED");
    await problemUtils.setProblemClosed(problemId);

    return res.redirect('../myProblems');
});


//Patch route allows user to edit name, type, software, hardware, os of their problems
//Access to employee users and specialist users
app.patch('/myProblems/:id', checkRoles("specialist", "employee"), function (req, res) {
    const { name, desc, type, hardware, software, os } = req.body;
    const id = parseInt(req.params.id);

    try { //Update each attribute seperately incase certain attributes are not inputted
        if (name) { //If name value is inputted
            conn.query(`UPDATE 
                        problems
                        SET
                        name = '${name}'
                        WHERE
                        problem_id = '${id}'`);
        }
        if (desc) { //If description value is inputted
            conn.query(`UPDATE 
                        problems
                        SET
                        problem_description = '${desc}'
                        WHERE
                        problem_id = '${id}'`);
        } else { //If description value is not inputted
            conn.query(`UPDATE 
                        problems
                        SET
                        problem_description = NULL
                        WHERE
                        problem_id = '${id}'`);
        }
        if (type) { //If type value is inputted
            conn.query(`SELECT 
                        *
                        FROM 
                        problem_types
                        WHERE
                        problem_type = '${type}'`,
                        function(err, rows) { //Get data from problem types to use to update problem type id
                            if (err) {
                                console.error('Error: ' + err);
                            } else {
                                const type_id = rows[0]["problem_type_id"]
                                conn.query(`UPDATE 
                                            problems
                                            SET
                                            problem_type_id = '${type_id}'
                                            WHERE
                                            problem_id = '${id}'`);
                            }
                        })
        }
        if (hardware != 'N/A') { //If hardware has valid input
            if (hardware == 'NULL') {
                conn.query(`UPDATE 
                            problems
                            SET
                            hardware_id = NULL,
                            serial = NULL
                            WHERE
                            problem_id = '${id}'`);
            } else { 
                conn.query(`SELECT 
                            *
                            FROM 
                            hardware_relation
                            WHERE
                            hardware_id = '${hardware}'`,
                            function(err, rows) { //Get serial number from relation table of submitted id then update problems table
                                if (err) {
                                    console.error('Error: ' + err);
                                } else {
                                    const serial = rows[0]["serial"]
                                    conn.query(`UPDATE 
                                                problems
                                                SET
                                                hardware_id = '${hardware}',
                                                serial = '${serial}'
                                                WHERE
                                                problem_id = '${id}'`);
                                }
                            })
            }
        }
        if (software != 'N/A') { //If software has valid input
            if (software == 'NULL') {
                conn.query(`UPDATE 
                            problems
                            SET
                            software_id = NULL,
                            license = NULL
                            WHERE
                            problem_id = '${id}'`);
            } else {
                conn.query(`SELECT 
                            *
                            FROM 
                            software_relation
                            WHERE
                            software_id = '${software}'`,
                            function(err, rows) { //Get license number from relation table of submitted id then update problems table
                                if (err) {
                                    console.error('Error: ' + err);
                                } else {
                                    const license = rows[0]["license"]
                                    conn.query(`UPDATE 
                                                problems
                                                SET
                                                software_id = '${software}',
                                                license = '${license}'
                                                WHERE
                                                problem_id = '${id}'`);
                                }
                            })
            }                
        }
        if (os != 'N/A') { //If os has valid input
            if (os == 'NULL') {
                conn.query(`UPDATE 
                            problems
                            SET
                            os_id = NULL
                            WHERE
                            problem_id = '${id}'`);
            } else { 
                conn.query(`UPDATE
                            problems
                            SET
                            os_id = '${os}'
                            WHERE
                            problem_id = '${id}'`);
            }
        }
        res.status(200);
        res.redirect('/myProblems'); //Direct user back to dashboard with problems updated
    } catch (err) {
        console.log(err);
        res.render({ message: "Error in request" });
    }
});

module.exports = app;
