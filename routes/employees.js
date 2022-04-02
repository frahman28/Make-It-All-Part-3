var express = require('express');
var app = express.Router();

/* GET dashboard page. */
app.get('/', function(req, res, next) {
  res.render('problems/my_problems');
});

module.exports = app;
