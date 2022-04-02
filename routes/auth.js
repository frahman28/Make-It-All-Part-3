var express = require('express');
var app = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conn  = require('../dbconfig');

/* GET home page. */

app.get('/', function(req, res, next) {
  if (req.session.loggedIn) {
    // TO CHANGE
    res.redirect("../" + req.session.userRole)
  } else {
    req.session.loggedIn = false;
    res.redirect('/login');
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
                    req.session.userRole = userRole; 
                    req.session.userName = req.body.username;
                    return res.redirect('../' + userRole);
                    
                } else {
                    return res.render('login', {
                        errorMessage: 'Something went wrong!'
                    });
                }
            });
        }
    );
});

app.get('/logout', function(req, res) {
    req.session.loggedIn = false;
    req.session.destroy();
    res.redirect('/');
});


module.exports = app;
