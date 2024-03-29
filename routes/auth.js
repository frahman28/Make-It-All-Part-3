// auth.js
// Has routes and endpoints that handle 
// user authorization and password change.


var express  = require('express');
var app      = express.Router();
const bcrypt = require('bcryptjs');
const conn   = require('../dbconfig');

const {secretKey, salt}           = require("../constants");
const {verifySession, checkRoles} = require("../utils/auth.utils");


// route:  GET /
// access: ALL NOT LOGGED IN
// Navigates user to their dashboard, if they are logged in
// (session exists). Otherwise logs them out.
app.get('/', function(req, res) {
  if (req.session.userId) {
      if (req.session.userRole == "specialist" || req.session.userRole == "employee") {
        res.redirect("/myProblems")
      } else {
        res.redirect("/dashboard")
      }
  } else {
    res.redirect('/logout');
  }
  res.end();
});


// route:  GET /login
// access: ALL NOT LOGGED IN
// Renders the login page.
app.get('/login', function(req, res) {
    res.render('login');
});


// route:  POST /login
// access: ALL NOT LOGGED IN
// Renders the login page.
app.post('/login', (req, res) => {
    // Get inputted username and password.
    let username = req.body.username;
    let password = req.body.password;

    // If no username or password provided, 
    if (!username || !password) {
        return res.render('login', {
            errorMessage: 'Please provide both your username and password.'
        });
    }

    // Retreive details about user of a given username.
    conn.query(
        `SELECT login_info.employee_id AS userId, 
        username, 
        role, 
        password
        FROM company_roles, login_info, employees 
        WHERE company_roles.role_id = employees.role_id 
        AND login_info.employee_id = employees.employee_id 
        AND username = "${username}";`,
        (err, result) => {
        // If error or no incorrect login details show error message.
        if (!result.length || err) {
            return res.render('login', {
                errorMessage: 'Invalid username or password.'
            });
        }

        // Compare password with hashed copy in the database.
        bcrypt.compare(
            password, result[0]["password"],
            (bErr, bResult) => {
                // If error occured, show error message.
                if (bErr) {
                    return res.render('login', {
                        errorMessage: 'Invalid username or password.'
                    });
                }

                if (!bResult) {
                    // If incorrect pasword.
                    return res.render('login', {
                        errorMessage: 'Invalid username or password.'
                    });
                }

                let userId   = result[0]['userId'];
                let userRole = (result[0]['role']).toLowerCase();

                // Create a session and store user's details.
                req.session.userId   = userId;
                req.session.userName = username;
                req.session.userRole = userRole;

                // Redirect users to their dashboards accordingly to their role.
                if (userRole === "adviser" || userRole == "admin") {
                    return res.redirect('/dashboard');
                } else {
                    return res.redirect('/myProblems');
                }

            });
        }
    );
});


// route:  GET /settings
// access: ALL LOGGED IN
// Renders the page for password change.
app.get('/settings', verifySession, function(req, res) {
    res.render("settings", {userName: req.session.userName, role: req.session.userRole});
});


// route:  POST /settings
// access: ALL LOGGED IN
// Renders the page for password change.
app.post('/settings', verifySession, function(req, res, next) {
    // Get inputted username and password.
    let newPassword = req.body["new-password"];
    let confirmNewPassword = req.body["confirm-new-password"];

    // If no username or password provided, show error message. 
    if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
        return res.render('settings', {
                            userName: req.session.userName,
                            messageType: "danger",
                            role: req.session.userRole,
                            message: 'Ensure that your passwords are the same.'
        });
    }

    // Hash the new password and save it in the databse.
    bcrypt.hash(newPassword, salt, function(err, hash) {
        // If error occured.
        if (err) {
            return res.render("settings", {
                userName: req.session.userName,
                role: req.session.userRole,
                messageType: "danger",
                message: "Something went wrong."
            });
        }

        let userId = req.session.userId;

        // Update password for current user in the database.
        conn.query(`UPDATE login_info 
                    SET password = '${hash}'
                    WHERE employee_id = ${userId};`,
            (bErr, bResult) => {
            // If error occured, show error message.
            if (bErr) {
                res.render("settings", {
                    userName: req.session.userName,
                    messageType: "danger",
                    role: req.session.userRole,
                    message: "Something went wrong."
                });
            } else {
                // Otherwise inform about successful operation.
                res.render("settings", {
                    userName: req.session.userName,
                    messageType: "success",
                    role: req.session.userRole,
                    message: "Password updated successfully!"
                });
            }
        });
    });
});

// route:  ALL /logout
// access: ALL NOT LOGGED IN
// Destroys the session and redirects to the login page.
app.all('/logout', function(req, res) {
    // Destroy all information stored in the session about user.
    if (req.session) req.session.destroy();
    res.redirect('/login');
});


module.exports = app;
