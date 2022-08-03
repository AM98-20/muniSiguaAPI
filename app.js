require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');
const { passport } = require('./config/jwt.strategy');
const cors = require('cors');

const whiteList = [process.env.CORS_ORIGIN, 'http://localhost:3001', 'http://127.0.0.1:3001'];
console.log(whiteList);
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  }
}

var indexRouter = require('./routes/index');

var app = express();
app.use(passport.initialize());

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use('*', function (req, res) {
  res.status(404).json({ status: 'failed', msg: "Route not found" });
});

module.exports = app;