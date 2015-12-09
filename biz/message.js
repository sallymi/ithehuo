/**
 * Handle message requests
 *
 * @module biz/message
 *
 */
var Q = require('q');
var messageProxy = require('../persistent/proxy/message.js');
var userProxy = require('../persistent/proxy/user.js');
var requestProxy = require('../persistent/proxy/request.js');
var relationProxy = require('../persistent/proxy/relation.js');
var projectProxy = require('../persistent/proxy/project.js');
var resUtil = require('../utils/response');
var reqUtil = require('../utils/request');
var logger = require('../utils/log').getLogger('biz/message.js');

/**
 * Request handler for messages page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.messagesPage = function (req, res) {
  var method = '[messagesPage]';
  logger.info(method, 'request received to get all incomming messages of the signin user');
  var uid = reqUtil.getUserId(req);

  Q.all(
    [
      messageProxy.find({ 'to': uid }),
      userProxy.findUserById(uid),
      requestProxy.find({'target': uid}),
      relationProxy.find('users', uid),
      userProxy.findUsers({'followings': uid})
    ]
  ).spread(function (incommingMsgs, user, requests, relations, followers) {
    logger.info(method, 'find complete');
    logger.info(method, 'messages number: ' + incommingMsgs.length);
    logger.info(method, 'requests number: ' + requests.length);
    logger.info(method, 'relations number: ' + relations.length);
    logger.info(method, 'followers number: ' + followers.length);
    logger.info(method, 'followings number: ' + user.followings.length);

    logger.info(method, 'will render my messages page');
    resUtil.render(req, res, 'messages', {
      'title': '我的消息',
      'messages': incommingMsgs,
      'user': user,
      'requestsNumber': requests.length,
      'friendsNumber': relations.length,
      'followersNumber': followers.length
    });
  }).fail(function (err) {
    logger.error(method, 'failed to render messages page');
    logger.error(err);
    logger.info(method, 'will render error page');
    resUtil.render(req, res, 'error');
  });
};

/**
 * Request handler for chat page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.chatPage = function (req, res) {
  var method = '[chatPage]';
  logger.info(method, 'request received to chat page');

  var myId = reqUtil.getUserId(req);
  var targetId = req.params.uid;

  logger.info(method, 'try to find chat target user');
  userProxy
    .findUserById(targetId)
    .then(function (targetUser) {
      logger.info(method, 'check if target user exist');
      if (!targetUser) {
        logger.info(method, 'user not found');
        return Q.reject({ title: '您查找的用户不存在' });
      }

      logger.info(method, 'target user found');
      return [
        targetUser,
        messageProxy.find({ $or : [{'from': myId, 'to': targetId}, {'from': targetId, 'to': myId}] }),
        projectProxy.findProjects({ 'creator.user': targetId }),
        relationProxy.findByUsersId(myId, targetId)
      ];

    }).spread(function (targetUser, messages, projects, relation) {
      logger.info(method, messages.length + ' messages founds');

      logger.info(method, 'will render chat page');
      resUtil.render(req, res, 'message', {
        'title': '和' + targetUser.name + '发消息',
        'messages': messages,
        'user': targetUser,
        'projects': projects,
        'isFriend': relation ? true : false
      });

      logger.info(method, 'try to mark messages as read');
      return messageProxy.markRead({
        'from': targetId,
        'to': myId
      });

    }).then(function (writeResult) {
      logger.info(method, writeResult.nModified + ' messages marked as read');

    }).fail(function (err) {
      logger.error(method, 'failed render chat page');
      logger.error(err);
      logger.info(method, 'will render error page');
      resUtil.render(req, res, 'error');
    });
};

/**
 * Request handler for create a message
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createMessage = function (req, res) {
  var method = '[createMessage]';
  logger.info(method, 'request received to create a message');

  var message = req.body;
  logger.info(method, 'message: ' + JSON.stringify(message));

  logger.info(method, 'try to create message');
  messageProxy
    .create(message.from, message.to, message.msg)
    .then(function (messageCreated) {
      logger.info(method, 'message created');
      logger.info(method, JSON.stringify(messageCreated));
      logger.info(method, 'will response with created message');
      res.json(messageCreated);
    }).fail(function (err) {
      logger.error(method, 'failed create message');
      logger.error(err);
      logger.info(method, 'will response with error');
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
exports.getMessagesCount = function (req, res) {
  var method = '[getMessagesCount]';
  logger.info(method, 'request received to get message count');

  var uid = req.params.uid;
  var filter = req.query || {};
  filter.to = uid;
  logger.info(method, 'filter: ' + JSON.stringify(filter));

  logger.info(method, 'try to query message count');
  messageProxy
    .queryCount(filter)
    .then(function (count) {
      logger.info(method, 'query done');
      logger.info(method, 'messages count: ' + count);
      res.status(200).json({
        'count': count
      });
    }).fail(function (err) {
      logger.error(method, 'failed to query messages count');
      logger.error(err);
      logger.info(method, 'will response with error');
      res.status(500).json(err);
    });
};