/**
 * Handle search requests
 *
 * @module biz/search
 *
 */
var recruitmentProxy = require('../persistent/proxy/recruitment');
var projectProxy = require('../persistent/proxy/project.js');
var questionProxy = require('../persistent/proxy/question.js');
var resUtil = require('../utils/response');
var logger = require('../utils/log').getLogger('biz/search.js');


/**
 * Request handler for search request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.search = function (req, res) {
  logger.info('search request received');
  var type = req && req.query && req.query.type;
  var key = req && req.query && req.query.key;
  logger.info('search type: ' + type);
  logger.info('search key:' + key);

  switch (type) {
  case 'project':
    projectProxy.search(key).then(function (projects) {
      resUtil.render(req, res, 'projects', {
        'projects': projects
      });
    }).fail(function (err) {
      logger.error('error occur when try perform search, see bellow error');
      logger.error(err);
      logger.debug('will render error page');
      resUtil.render(req, res, 'error', err);
    });
    break;
  case 'recruitment':
    recruitmentProxy.search(key).then(function (recruitments) {
      resUtil.render(req, res, 'recruitments', {
        'recruitments': recruitments
      });
    }).fail(function (err) {
      logger.error('error occur when try perform search, see bellow error');
      logger.error(err);
      logger.debug('will render error page');
      resUtil.render(req, res, 'error', err);
    });
    break;
  case 'question':
    questionProxy.search(key).then(function (questions) {
      resUtil.render(req, res, 'questions', {
        'questions': questions
      });
    }).fail(function (err) {
      logger.error('error occur when try perform search, see bellow error');
      logger.error(err);
      logger.debug('will render error page');
      resUtil.render(req, res, 'error', err);
    });
    break;
  }
};