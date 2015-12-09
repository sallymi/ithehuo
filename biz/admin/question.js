/**
 * Handle question and answer admin requests
 *
 * @module biz/admin/questions
 *
 */
var Q = require('q');
var questionProxy = require('../../persistent/proxy/question.js');
var answerProxy = require('../../persistent/proxy/answer.js');
var reqUtil = require('../../utils/request');
var resUtil = require('../../utils/response');
var logger = require('../../utils/log').getLogger('biz/admin/question.js');

exports.questionsPage = function (req, res) {
  var method = '[questionsPage]';
  logger.info(method, 'request to questions admin page');

  questionProxy.findQuestions().then(function (questions) {
    logger.info(method, questions.length + " questions found");
    logger.info(method, 'will render question page');
    res.render('admin/questions', {
      'questions': questions,
      'header': '问答管理/问题管理'
    });
  }).fail(function (err) {
    logger.error(err);
    res.render('error');
  });
};

exports.questionPage = function (req, res) {
  var method = '[questionPage]';
  logger.info(method, 'request to question\'s comment and answer admin page');

  var qid = req.params.qid;
  logger.info(method, 'qid: ' + qid);

  var promises = [
    questionProxy.findQuestionById(qid),
    answerProxy.findAnswers({'question': qid})
  ];

  Q.all(promises).spread(function (question, answers) {
    logger.info(method, 'question found');
    logger.info(method, answers.length + ' answers found');
    logger.info(method, question.comment.length + ' comments found');
    logger.info(method, 'will render question\'s comment and answer admin page');
    res.render('admin/question', {
      'question': question,
      'answers': answers,
      'header': '问答管理/问题答案和评论管理'
    });
  }).fail(function (err) {
    logger.error(err);
    res.render('error');
  });
};

exports.updateQuestion = function (req, res) {
  var method = '[updateQuestion]';
  logger.info(method, 'request received to update question');

  var qid = req.params.qid;
  var title = req.body.title;
  var content = req.body.content;

  logger.info(method, 'try to update question');
  logger.info(method, 'qid: ' + qid);
  logger.info(method, 'title: ' + title);
  logger.info(method, 'content: ' + content);
  questionProxy.updateQuestion(qid, title, content).then(function () {
    logger.info(method, 'question updated');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to update question');
    logger.error(err);
    logger.info('will resonse with error json');
    res.status(500).json(err);
  });
};

exports.deleteQuestion = function (req, res) {
  var method = '[deleteQuestion]';
  var qid = req.params.qid;
  logger.info(method, 'request to delete question, qid: ' + qid);
  questionProxy
    .deleteQuestion(qid)
    .then(function () {
      logger.info(method, 'question deleted, qid: ' + qid);
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

  var qid = req.params.qid;
  var cid = req.params.cid;
  var content = req.body.content;

  logger.info(method, 'try to update comment');
  logger.info(method, 'qid: ' + qid);
  logger.info(method, 'cid: ' + cid);
  logger.info(method, 'content: ' + content);
  questionProxy.updateComment(qid, cid, content).then(function () {
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

  var qid = req.params.qid;
  var cid = req.params.cid;
  logger.info(method, 'question id: ' + qid);
  logger.info(method, 'comment id: ' + cid);

  logger.info(method, 'try to delete comment');
  questionProxy.deleteComment(qid, cid).then(function () {
    logger.info(method, 'comment deleted');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, err);
    res.status(500).json(err);
  });
};