var express = require('express');
var app = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conn  = require('../dbconfig');

/* GET home page. */

app.get('/', function(req, res, next) {
  if (req.session.loggedIn) {
    // TO CHANGE
    res.redirect("/myProblems")
  } else {
    res.redirect('/logout');
  }
  res.end();
});


app.get('/login', function(req, res, next) {
    res.render('login');
});


app.post('/login', (req, res, next) => {
    conn.query(
        `SELECT login_info.employee_id, role, password
        FROM company_roles, login_info, employees 
        WHERE company_roles.role_id = employees.role_id 
        AND login_info.employee_id = employees.employee_id 
        AND username = "${req.body.username}";`,
        (err, result) => {
        // If no username or result provided.
        if (!result.length || err) {
            return res.render('login', {
                errorMessage: 'Email or password is incorrect!'
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
                        errorMessage: 'Email or password is incorrect!'
                    });
                }

                if (bResult) {
                    const token = jwt.sign({id:result[0]['employee_id']}, 'Make-It-All-Team-15',{ expiresIn: '1h' });
                    var userRole = result[0]["role"].toLowerCase();
                    req.session.loggedIn = true;
                    req.session.userId = result[0]['employee_id']; 
                    req.session.userRole = userRole; 
                    req.session.userName = req.body.username;
                    return res.redirect('myProblems');
                    
                } else {
                    return res.render('login', {
                        errorMessage: 'Something went wrong!'
                    });
                }
            });
        }
    );
});

app.get('/settings', function(req, res) {
    res.render("settings", {userName: req.session.userName});
});

app.post('/settings', function(req, res, next) {
    bcrypt.hash(req.body["new-password"], 15, function(err, hash) {
        // console.log(req.body["new-password"])
        // console.log(hash)
        conn.query(
            `UPDATE login_info 
            SET password = '${hash}'
            WHERE employee_id = ${req.session.userId};`,
            (err, result) => {
                
            if (err) {
                console.log("ERROR: " + err);
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
    req.session.destroy();
    res.redirect('/login');
});


module.exports = app;
