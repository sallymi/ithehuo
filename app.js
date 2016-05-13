var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('./utils/log').getLogger('app.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compress = require('compression');
var routes = require('./routes/router');
// var users = require('./routes/users');
var config = require('./config');
var connection = require('./persistent/connection');
var oss = global.oss = config.oss;
var limit = global.limit = config.limit;

var app = express();

// view engine setup
app.use(compress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.moment = require('moment');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*
 * middlewares
 */
var oneDay = 86400000;
var oneYear = oneDay * 365;
var tenYear = oneYear * 10;

// app.use(express.static('./static'));
// app.use(express.static('./public',{ maxAge: tenYear }));
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'public'),{ maxAge: tenYear }));

app.use(routes);
// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

connection.connect().then(function () {
  var server = app.listen(80, function () {
    logger.info('server started, listen on port %d', server.address().port);
  });
  var io  = require('socket.io')(server);
  io.sockets.on('connection', function (socket) {
    socket.on('private message', function (from, to, msg, timestamp) {
      logger.info('I received a private message by ', from, ' say to ', to, msg);
      socket.broadcast.emit('to' + to, {from : from, to : to, msg : msg, timestamp : timestamp});
     
    });
    socket.on('add friend', function (from, to, msg, timestamp) {
      logger.info('I received an add friend request from ', from, ' say to ', to, msg);
      socket.broadcast.emit('add friend' + to, {from : from, to : to, msg : msg, timestamp : timestamp});
     
    });
    socket.on('disconnect', function () {
      socket.broadcast.emit('user disconnected');
    });
  });
}).fail(function (err) {
  logger.error('failed to start server due to bellow error:');
  logger.error(err);
});

module.exports = app;
