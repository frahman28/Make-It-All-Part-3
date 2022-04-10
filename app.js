var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var morgan       = require("morgan");
var helmet       = require("helmet");
var cors         = require("cors");
var ejs          = require('ejs');
const session    = require('express-session');
var flash        = require('connect-flash');
const { secretKey, salt } = require("./constants");

// Uncomment to populate the database with testing data.
// const c          = require("./dbcreate");

var indexRouter  = require('./routes/auth');
var problemsRouter  = require('./routes/problems');

// Initialize the app.
var app = express();

// Set up view engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());

// Set up sessions.
app.use(session({
	secret: secretKey,
	resave: true,
	saveUninitialized: true
}));

// Use flash messages in the app.
app.use(flash());

// Show details in console whilst debugging.
app.use(morgan("common"));

// Protect HTTP requests.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Handle Cross-Origin errors.
app.use(cors());

app.use(express.urlencoded({ extended: false }));

// Enable cookies.
app.use(cookieParser());

// Set up static files path.
app.use(express.static(path.join(__dirname, 'public')));


// Add routes.
app.use('/', indexRouter);
app.use('/', problemsRouter);

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler.
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page.
  res.status(err.status || 500);
  res.render('error', { errorMessage: err});
});

module.exports = app;