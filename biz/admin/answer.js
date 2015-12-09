/**
 * Handle question and answer admin requests
 *
 * @module biz/admin/questions
 *
 */
var Q = require('q');
var answerProxy = require('../../persistent/proxy/answer.js');
var reqUtil = require('../../utils/request');
var resUtil = require('../../utils/response');
var logger = require('../../utils/log').getLogger('biz/admin/answer.js');

exports.answerPage = function (req, res) {
  var method = '[answerPage]';
  logger.info(method, 'request to answer\'s comment admin page');

  var aid = req.params.aid;
  logger.info(method, 'aid: ' + aid);

  answerProxy.findAnswerById(aid).then(function (answer) {
    logger.info(method, 'answer found');
    logger.info(method, 'will render answer\'s comment admin page');

    res.render('admin/answer', {
      'answer': answer,
      'header': '问答管理/答案评论管理'
    });
  }).fail(function (err) {
    logger.error(err);
    res.render('error');
  });
};

exports.updateAnswer = function (req, res) {
  var method = '[updateAnswer]';
  logger.info(method, 'request received to update answer');

  var aid = req.params.aid;
  var content = req.body.content;

  logger.info(method, 'try to update answer');
  logger.info(method, 'answer id: ' + aid);
  logger.info(method, 'content: ' + content);
  answerProxy.updateAnswer(aid, content).then(function () {
    logger.info(method, 'answer updated');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to update answer');
    logger.error(err);
    logger.info('will resonse with error json');
    res.status(500).json(err);
  });
};

exports.deleteAnswer = function (req, res) {
  var method = '[deleteAnswer]';
  var aid = req.params.aid;
  logger.info(method, 'request to delete answer, aid: ' + aid);
  answerProxy
    .deleteAnswer(aid)
    .then(function () {
      logger.info(method, 'answer deleted');
      logger.info(method, 'will response with success message');
      resUtil.okJson(res);
    }).fail(function (err) {
      logger.error(method, err);
      resUtil.errJson(res);
    });
};

exports.updateComment = function (req, res) {
  var method = '[updateComment]';
  logger.info(method, 'request received to update comment');

  var aid = req.params.aid;
  var cid = req.params.cid;
  var content = req.body.content;

  logger.info(method, 'try to update comment');
  logger.info(method, 'aid: ' + aid);
  logger.info(method, 'cid: ' + cid);
  logger.info(method, 'content: ' + content);
  answerProxy.updateComment(aid, cid, content).then(function () {
    logger.info(method, 'comment updated');
    logger.info(method, 'will response with success message');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to update comment');
    logger.error(err);
    logger.info('will resonse with error json');
    res.status(500).json(err);
  });
};

exports.deleteComment = function (req, res) {
  var method = '[deleteComment]';
  logger.info(method, 'request received to delete comment');

  var aid = req.params.aid;
  var cid = req.params.cid;
  logger.info(method, 'answer id: ' + aid);
  logger.info(method, 'comment id: ' + cid);

  logger.info(method, 'try to delete comment');
  answerProxy.deleteComment(aid, cid).then(function () {
    logger.info(method, 'comment deleted');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, err);
    res.status(500).json(err);
  });
};