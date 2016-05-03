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

exports.active = function (req, res) {
  var uid = req.body.uid;;
  console.log(uid);
  userProxy.updateActive(uid, true).then(function () {
    //res.redirect('/admin/users');
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    resUtil.render(req, res, 'error', err);
  });
}
exports.deActive = function (req, res) {
  var uid = req.body.uid;;
  console.log(uid);
  userProxy.updateActive(uid, false).then(function () {
    //res.redirect('/admin/users');
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    resUtil.render(req, res, 'error', err);
  });
}

exports.addTop = function (req, res) {
  var uid = req.body.uid;
  userProxy.updateTop(uid, true, 1).then(function () {
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
  });
};

exports.removeTop = function (req, res) {
  var uid = req.body.uid;
  userProxy.updateTop(uid, false).then(function () {
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
  });
};

// exports.addRecommended = function (req, res) {
//   var pid = req.body.pid;
//   userProxy.updateRecommended(pid, true).then(function () {
//     res.json('success');
//   }).fail(function (err) {
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

// exports.removeRecommended = function (req, res) {
//   var pid = req.body.pid;
//   userProxy.updateRecommended(pid, false).then(function () {
//     res.json('success');
//   }).fail(function (err) {
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };