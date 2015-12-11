/**
 * Provides the DB connection
 *
 * @module persistent/connection
 *
 */

var mongoose = require('mongoose');
var Q = require('q');
var logger = require('../utils/log').getLogger('persistent/connection');

var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
var dbUrl = (process.env.DB_PORT_27017_TCP_ADDR || 'localhost');
//var dbName = (process.env.DB_NAME || '/test');
var dbName = '/ithhr/db';
var url = 'mongodb://'+dbUrl+dbName;
var options = {
  db: { native_parser: true },
  server: {poolSize: 5, socketOptions : { keepAlive: 1}},
  user: '',
  pass: ''
};

/**
 * Connect to mongo DB
 *
 * @function
 * @return {Promise} Promise to connect to mongo DB
 *
 */
exports.connect = function () {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to connect to the mongodb, url: ' + url);
    mongoose.connect(url, options, function (err) {
      if (err) {
        logger.error('failed to connected to the mongodb, url: ' + url + ', due to bellow error:');
        logger.error(err);
        reject(err);
      } else {
        logger.debug('connected to the mongodb, url: ' + url);
        logger.debug('bind error handler to mongodb connection');
        mongoose.connection.on('error', function (err) {
          logger.error('error occur for the mongodb connection');
          logger.error(err);
        });
        resolve();
      }
    });
  });
};

/**
 * Close all the connections to mongo DB
 *
 * @function
 * @return {Promise} Promise to close all the connections to mongo DB
 *
 */
exports.disconnect = function () {
  logger.debug('try to disconnect to the mongodb');
  return Q.Promise(function (resolve, reject) {
    mongoose.disconnect(function (err) {
      if (err) {
        logger.error('error occurs when try to close the connections');
        logger.error(err);
        reject(err);
      } else {
        logger.debug('all connections are closed');
        resolve();
      }
    });
  });
};