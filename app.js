var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var morgan       = require("morgan");
var helmet       = require("helmet");
var cors         = require("cors");
var ejs          = require('ejs');
const session    = require('express-session');

const c          = require("./dbcreate");

var indexRouter  = require('./routes/auth');
var usersRouter  = require('./routes/employees');
var equipmentRouter = require("./routes/equipment");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());

// for better display in the terminal
app.use(morgan("common"));

// for HTTP protection
app.use(helmet());

// for cross-origin sources
app.use(cors());

app.use(express.urlencoded({ extended: false }));

// cookie parser middleware
app.use(cookieParser());

// images
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'team015-make-it-all-2022',
	resave: true,
	saveUninitialized: true
}));

// Add middleware
app.use('/', indexRouter);
app.use('/employee', usersRouter);
app.use('/', equipmentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
