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
  res.render('login');
});


module.exports = app;
