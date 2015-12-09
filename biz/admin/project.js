/**
 * Handle project admin requests
 *
 * @module biz/admin/project
 *
 */
var Q = require('q');
var projectProxy = require('../../persistent/proxy/project.js');
var recruitmentProxy = require('../../persistent/proxy/recruitment.js');
var reqUtil = require('../../utils/request');
var resUtil = require('../../utils/response');
var logger = require('../../utils/log').getLogger('biz/admin/project.js');

exports.projectPage = function (req, res) {
  var filter = req.query;
  projectProxy.findProjects(filter).then(function (projects) {
    var i;
    var promises = [];
    for (i = 0; i < projects.length; i++) {
      promises.push(recruitmentProxy.find({
        'project': projects[i].id
      }));
    }
    return [projects, Q.all(promises)];
  }).spread(function (projects, recruitments) {
    var i;
    for (i = 0; i < projects.length; i++) {
      projects[i].recruitments = recruitments[i];
    }
    resUtil.render(req, res, 'admin/project', {
      'projects': projects,
      'header': '项目管理'
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