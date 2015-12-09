/**
 * Handle add friend relations requests
 *
 * @module biz/request
 *
 */
var Q = require('q');
var relationProxy = require('../persistent/proxy/relation');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var logger = require('../utils/log').getLogger('biz/request.js');

/**
 * Request handler to terminate a relation
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.terminateRelation = function (req, res) {
  var method = '[terminateRelation]';
  logger.info(method, 'request received to terminate a request');

  var rid = req.params.rid;

  logger.info(method, 'try to remove relation');
  relationProxy
    .removeById({ '_id' : rid})
    .then(function () {
      logger.info(method, 'relation removed');
      logger.info(method, 'will response with success message');
      res.json('success');
    })
    .fail(function (err) {
      logger.error(method, 'faild to accept remove relation');
      logger.error(err);
      res.status(500).json(err);
    });
};