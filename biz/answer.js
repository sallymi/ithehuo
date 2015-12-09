/**
 * Handle answers related requests
 *
 * @module biz/answers
 *
 */
var Q = require('q');
var questionProxy = require('../persistent/proxy/question');
var answerProxy = require('../persistent/proxy/answer');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var logger = require('../utils/log').getLogger('biz/answer.js');

/**
 * Request handler to create a answer
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createAnswer = function (req, res) {
  var method = '[createAnswer]';
  logger.info(method, 'request received to create a answer');

  var answerToCreate = req.body;
  answerToCreate.created_by = reqUtil.getUserId(req);
  logger.info(method, JSON.stringify(answerToCreate));

  answerProxy.createAnswer(answerToCreate).then(function (answerCreated) {
    logger.info(method, 'answer created');
    res.json(answerCreated);
  }).fail(function (err) {
    logger.error(method, 'faild to create answer');
    logger.error(err);
    res.status(500).json(err);
  });
};

/**
 * Request handler to create a answer comment
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createAnswerComment = function (req, res) {
  var method = '[createAnswerComment]';
  logger.info(method, 'request received to create a answer comment');

  var aid = req.params.aid;
  var uid = reqUtil.getUserId(req);
  var commentToCreate = req.body;

  commentToCreate.created_by = uid;
  logger.info(method, commentToCreate);

  logger.info(method, 'try create comment');
  answerProxy.saveComment(aid, commentToCreate).then(function () {
    logger.info(method, 'comment created, will response with success message');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to create comment');
    logger.error(err);
    logger.info(method, 'will response with the error');
    res.status(500).json(err);
  });
};

/**
 * Request handler to create a answer agree
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createAnswerAgree = function (req, res) {
  var method = '[createAnswerAgree]';
  logger.info(method, 'request received to create a answer agree');

  var aid = req.params.aid;
  var uid = reqUtil.getUserId(req);
  logger.info(method, 'user id: ' + uid);

  logger.info(method, 'try create agree');
  answerProxy.createAgree(aid, uid).then(function () {
    logger.info(method, 'aggree created, will response with success message');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to create agree');
    logger.error(err);
    logger.info(method, 'will response with the error');
    res.status(500).json(err);
  });
};

/**
 * Request handler to delete a answer agree
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.deleteAnswerAgree = function (req, res) {
  var method = '[deleteAnswerAgree]';
  logger.info(method, 'request received to delete a answer agree');

  var aid = req.params.aid;
  var uid = reqUtil.getUserId(req);
  logger.info(method, 'user id: ' + uid);

  logger.info(method, 'try to delete agree');
  answerProxy.deleteAgree(aid, uid).then(function () {
    logger.info(method, 'aggree deleted, will response with success message');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to delete agree');
    logger.error(err);
    logger.info(method, 'will response with the error');
    res.status(500).json(err);
  });
};