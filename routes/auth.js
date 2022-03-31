var express = require('express');
var app = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
  if (req.session.loggedin) {
    res.send('Welcome back, ' + req.session.username + '!');
  } else {
    res.redirect('/login');
  }
  res.end();
});

app.get('/login', function(req, res, next) {
    if (session) {
        switch (session.userRole) {
            case 'employee':
                res.redirect('/employees');
                break;

            case 'specialist':
                res.redirect('/specialists');
                break;

            case 'admin':
                res.redirect('/admins');
                break;

            case  'analysts':
                res.redirect('/analysts');
                break;

            default:
                break;
        }
    }
  res.render('login');
});

app.post('/login', function(req, res, next) {
    // authenticate
    // res.redirect('/login');
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = app;
