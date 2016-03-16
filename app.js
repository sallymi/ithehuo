/*
 * module dependency
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var router = require('./routers/router');
var config = require('./config');
var connection = require('./persistent/connection');
var logger = require('./utils/log').getLogger('app.js');

/*
 * app setting
 */
var app = express();

app.set('view engine', 'jade');
app.locals.moment = require('moment');

/*
 * middlewares
 */
app.use(express.static('./static'));
app.use(express.static('./public'));
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': false}));
app.use(cookieParser());
app.use(router);

/*
 * start server
 */
connection.connect().then(function () {
  var server = app.listen(8005, function () {
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

