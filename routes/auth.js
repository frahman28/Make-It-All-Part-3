var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var userName = res.user.userName;
  res.render('dashboard',
    { title: 'Hello ' + userName });

    // retrieve problems
});


module.exports = router;
