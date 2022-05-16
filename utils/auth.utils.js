// auth.utils.js
// Stores callbacks to handl user authorization and
// authentication.


// Callback 
// Checks whether a session instance exists.
// (if there is any user of any role logged in). 
var verifySession = function(req, res, next) {
    // If no session exists, throw an error.
    if (!req.session.userId) {
        return res.sendStatus(403);
    }
    else {
        // Otherwise allow for running the function..
        next();
    }
};


// Callback 
// Checks whether a session instance exists.
// (if there is any user of any role logged in). 
function checkRoles(...permittedRoles) {
    // Return a middleware.
    return (req, res, next) => {
        // If no session exists, throw an error.
        if (!req.session.userId) return res.sendStatus(403);
        
        // If session exits and current user has requested role,
        // allow for running the function.
        if (req.session.userId && permittedRoles.includes(req.session.userRole)) {
            next();
        } else {
            // Otherwise throw an error.
            return res.sendStatus(401);
        }
    }
}

module.exports =  {verifySession, checkRoles};