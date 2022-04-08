var express = require('express');
var app = express.Router();
const bcrypt = require('bcryptjs');
const conn  = require('../dbconfig');
const {secretKey, salt} = require("../constants");
const {verifySession, checkRoles} = require("./middleware");


/* GET home page. */
app.get('/', function(req, res) {
  if (req.session) {
    res.redirect("/myProblems")
  } else {
    res.redirect('/logout');
  }
  res.end();
});


app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', (req, res) => {
    conn.query(
        `SELECT login_info.employee_id, username, role, password
        FROM company_roles, login_info, employees 
        WHERE company_roles.role_id = employees.role_id 
        AND login_info.employee_id = employees.employee_id 
        AND username = "${req.body.username}";`,
        (err, result) => {
        // If no username or result provided.
        if (!result.length || err) {
            return res.render('login', {
                errorMessage: 'Invalid username or password.'
            });
        }

        // check password
        bcrypt.compare(
            req.body.password,
            result[0]['password'],
            (bErr, bResult) => {
                // wrong password
                if (bErr) {
                    return res.render('login', {
                        errorMessage: 'Invalid username or password.'
                    });
                }

                if (bResult) {
                    
                    req.session.userId   = result[0]['employee_id']
                    req.session.userName = result[0]['username']
                    req.session.userRole = (result[0]['role']).toLowerCase()

                    return res.redirect('/myProblems');
                    
                } else {
                    return res.render('login', {
                        errorMessage: 'Invalid username or password.'
                    });
                }
            });
        }
    );
});

app.get('/settings', verifySession, function(req, res) {
    res.render("settings", {userName: req.session.userName});
});

app.post('/settings', verifySession, function(req, res, next) {
    bcrypt.hash(req.body["new-password"], salt, function(err, hash) {
        conn.query(`UPDATE login_info 
                    SET password = '${hash}'
                    WHERE employee_id = ${req.user.userId};`,
            (err, result) => {
                
            if (err) {
                res.render("settings", {
                    userName: req.session.userName,
                    messageType: "error",
                    message: "Something went wrong."
                });
            } else {
                res.render("settings", {
                    userName: req.session.userName,
                    messageType: "success",
                    message: "Password updated successfully!"
                });
            }
        });
    });
});

app.get('/logout', function(req, res) {
    if (req.session) req.session.destroy();
    res.redirect('/login');
});


module.exports = app;
