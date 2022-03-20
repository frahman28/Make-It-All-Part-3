var express = require('express');
var router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
  var userName = res.user.userName;
  res.render('dashboard',
    { title: 'Hello ' + userName });
});

module.exports = router;
