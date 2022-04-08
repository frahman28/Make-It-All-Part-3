var jwt = require("jsonwebtoken");
const { secretKey, salt } = require("../constants");


var verifySession = function(req, res, next) {
    if (!req.session) return req.sendStatus(403);
    else next();
  };

function checkRoles(...permittedRoles) {
    // return a middleware
    return (req, res, next) => {
        if (!req.session) return res.sendStatus(403);
        
        if (req.session && permittedRoles.includes(req.session.userRole)) {
            next();
        } else {
            return res.sendStatus(401);
        }
    }
}

module.exports =  {verifySession, checkRoles};