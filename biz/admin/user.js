/**
 * Handle project admin requests
 *
 * @module biz/admin/project
 *
 */
var Q = require('q');
var userProxy = require('../../persistent/proxy/user.js');
var recruitmentProxy = require('../../persistent/proxy/recruitment.js');
var reqUtil = require('../../utils/request');
var resUtil = require('../../utils/response');
var logger = require('../../utils/log').getLogger('biz/admin/project.js');

exports.userPage = function (req, res) {
  var filter = req.query;
  userProxy.findUsers(filter).then(function (users) {
    resUtil.render(req, res, 'admin/user', {
      'users': users,
      'header': '注册人员管理'
    });
  }).fail(function (err) {
    logger.error(err);
    resUtil.render(req, res, 'error', err);
  });
};

exports.addHot = function (req, res) {
  var pid = req.body.pid;
  projectProxy.updateHot(pid, true).then(function () {
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
  });
};

exports.removeHot = function (req, res) {
  var pid = req.body.pid;
  projectProxy.updateHot(pid, false).then(function () {
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
  });
};

exports.addRecommended = function (req, res) {
  var pid = req.body.pid;
  projectProxy.updateRecommended(pid, true).then(function () {
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
  });
};

exports.removeRecommended = function (req, res) {
  var pid = req.body.pid;
  projectProxy.updateRecommended(pid, false).then(function () {
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
  });
};