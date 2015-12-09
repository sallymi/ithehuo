/**
 * Handle add friend request requests
 *
 * @module biz/request
 *
 */
var Q = require('q');
var requestProxy = require('../persistent/proxy/request');
var relationProxy = require('../persistent/proxy/relation');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var logger = require('../utils/log').getLogger('biz/request.js');

/**
 * Request handler to create a friend request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createRequest = function (req, res) {
  var method = '[createRequest]';
  logger.info(method, 'request received to create a request');

  var uid = reqUtil.getUserId(req);
  var targetId = req.body.targetId;
  var requestMsg = req.body.requestMsg;

  var requestToCreate = {
    'requestor': uid,
    'target': targetId,
    'request_msg':requestMsg
  };

  requestProxy.create(requestToCreate).then(function (requestCreated) {
    logger.info(method, 'friend request created');
    logger.info(method, 'will response with the created request');
    res.json(requestCreated);
  }).fail(function (err) {
    logger.error(method, 'faild to create friend request');
    logger.error(err);
    res.status(500).json(err);
  });
};

/**
 * Request handler to accept a request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.acceptRequest = function (req, res) {
  var method = '[acceptRequest]';
  logger.info(method, 'request received to accept a request');

  var rid = req.params.rid;

  var update = {
    'status': 'accepted',
    'response_time': new Date()
  };

  logger.info(method, 'try to accept request');
  requestProxy
    .findOneAndUpdate({ '_id' : rid}, update)
    .then(function (request) {
      logger.info(method, 'request accepted');
      return relationProxy.findByUsersId(request.requestor.id, request.target.id);
    })
    .then(function (relation) {
      logger.info(method, 'check if relation already exist');
      if (relation) {
        logger.info(method, 'relation exist');
        return Q(relation);
      } else {
        logger.info(method, 'relation not exist');
        logger.info(method, 'try to create relation');
        return relationProxy.createByRequest(rid);
      }
    })
    .then(function () {
      logger.info(method, 'request accept done');
      logger.info(method, 'will response with success message');
      res.json('success');
    })
    .fail(function (err) {
      logger.error(method, 'faild to accept friend request');
      logger.error(err);
      res.status(500).json(err);
    });
};

/**
 * Request handler to deny a request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.denyRequest = function (req, res) {
  var method = '[denyRequest]';
  logger.info(method, 'request received to deny a request');

  var rid = req.params.rid;

  var update = {
    'status': 'denied',
    'response_time': new Date()
  };

  logger.info(method, 'try to deny request');
  requestProxy
    .updateById(rid, update)
    .then(function () {
      logger.info(method, 'request denied');
      logger.info(method, 'will response with success message');
      res.json('success');
    })
    .fail(function (err) {
      logger.error(method, 'faild to deny friend request');
      logger.error(err);
      res.status(500).json(err);
    });
};

/**
 * Request handler to ignore a request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.ignoreRequest = function (req, res) {
  var method = '[ignoreRequest]';
  logger.info(method, 'request received to ignore a request');

  var rid = req.params.rid;

  var update = {
    'status': 'ignored',
    'response_time': new Date()
  };

  logger.info(method, 'try to ignore request');
  requestProxy
    .updateById(rid, update)
    .then(function () {
      logger.info(method, 'request ignored');
      logger.info(method, 'will response with success message');
      res.json('success');
    })
    .fail(function (err) {
      logger.error(method, 'faild to ignore friend request');
      logger.error(err);
      res.status(500).json(err);
    });
};

/**
 * Request handler to get messages count
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getRequestsCount = function (req, res) {
  var method = '[getRequestsCount]';
  logger.info(method, 'request received to get requests count');

  var uid = req.params.uid;
  var filter = req.query || {};
  filter.target = uid;
  logger.info(method, 'filter: ' + JSON.stringify(filter));
  logger.info(method, 'try to query requests count');
  requestProxy
    .findByTarget(filter)
    .then(function (count) {
      logger.info(method, 'query done');
      logger.info(method, 'requests count: ' + count);
      res.status(200).json({
        'count': count
      });
    }).fail(function (err) {
      logger.error(method, 'failed to query requests count');
      logger.error(err);
      logger.info(method, 'will response with error');
      res.status(500).json(err);
    });
};