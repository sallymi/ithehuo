/**
 * Provide log functionality
 *
 * @module utils/log
 *
 */
var log4js = require('log4js');
var config = require('../config');

var level = log4js.levels.toLevel(config.log_level) !== undefined
  ? log4js.levels.toLevel(config.log_level)
  : 'info';

/**
 * Create a logger
 *
 * @function
 * @param {String} loggerName - the name of the new logger
 * @return {Logger} a logger
 *
 */
exports.getLogger = function (loggerName) {
  var logger = log4js.getLogger(loggerName);
  logger.setLevel(level);
  return logger;
};