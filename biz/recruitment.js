/**
 * Handle recruitment requests
 *
 * @module biz/recruitment
 *
 */

var Q = require('q');
var filters = require('../config.js').filters.recruitments;
var recruitmentProxy = require('../persistent/proxy/recruitment');
var projectProxy = require('../persistent/proxy/project.js');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var filterUtil = require('../utils/filter');
var logger = require('../utils/log').getLogger('biz/recruitment.js');
var config = require('../config');

/**
 * Request handler to new recruitment page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.newRecruitmentPage = function (req, res) {
  logger.info('request receive to new recruitment page');
  var requesterUid = reqUtil.getUserId(req);
  logger.info('try to find all the projects created by requester');
  projectProxy.findProjectsByCreatorUid(requesterUid).then(function (projects) {
    logger.info('projects found');
    logger.debug(projects);
    logger.info('will render recruitment_new page');
    resUtil.render(req, res, 'recruitment_new', {
      'projects': projects
    });
  }).fail(function (err) {
    logger.error('bellow error occur');
    logger.error(err);
    logger.debug('will render error page');
    resUtil.render(req, res, 'error', err);
  });
};

/**
 * Request handler to create a new recruitment
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createRecruitment = function (req, res) {
  logger.info('request received to create recruitment, bellow is the request body');
  logger.info(req.body);
  var recruitment = req.body;
  logger.info('try to create a new recruitment');
  recruitmentProxy.createRecruitment(recruitment).then(function (recruitment) {
    logger.info('bellow recruitment created, will response with the recruitment');
    logger.info(recruitment);
    res.json(recruitment);
  }).fail(function (err) {
    logger.error('error occur when try to create recruitment, will response with the error');
    logger.error(err);
    res.status(500).json(err);
  });
};
function getRecruitmentsService (req,res,fn){

  logger.info('request received to recruitments page');
  logger.info('filter: ' + JSON.stringify(req.query));

  // handle project related filter
  if (filterUtil.toProjectFilter(req.query)) {
    var projectFilter = filterUtil.toProjectFilter(req.query);
    projectProxy.findProjects(projectFilter).then(function (projects) {
      var promises = [];
      var i;
      for (i = 0; i < projects.length; i++) {
        promises.push(recruitmentProxy.find({
          'project': projects[i].id
        }));
      }
      return Q.all(promises);
    }).then(function (result) {
      var recruitments = [];
      var i;
      for (i = 0; i < result.length; i++) {
        recruitments = recruitments.concat(result[i]);
      }
      fn.success(req,res,{
        'recruitments': recruitments,
        'filters': filters
      });

    }).fail(function (err) {
      logger.error(err);
      fn.fail(req,res,err);
    });
    return;
  }

  var filter = filterUtil.toMongoFilter(req.query);
  if(!filter.limit)
      filter['limit']=config.limit;
  logger.info('try to find all recruitments');
  recruitmentProxy.findLimit(filter).then(function (recruitments) {
    logger.info('find complete');
    logger.info('will render recruitments page with bellow recruitments');
    logger.info(recruitments);
    fn.success(req,res, {
      'recruitments': recruitments,
      'filters': filters
    });
  }).fail(function (err) {
    logger.error('error occur when try to find all the recruitments, see bellow error');
    logger.error(err);
    logger.debug('will render error page');
    fn.fail(req,res,err);
  });
}
/**
 * Request handler for recruitments page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getRecruitments = function (req, res) {
  getRecruitmentsService(req,res,{
    success:function(req,res,obj){
      resUtil.render(req, res, 'recruitments', obj);
    },
    fail:function(req,res,err){
      resUtil.render(req, res, 'error', err);
    }
  })
};
exports.getRecruitmentsAjax = function (req, res) {
  getRecruitmentsService(req,res,{
    success:function(req,res,obj){
      res.send(obj);
    },
    fail:function(req,res,err){
      res.send( err);
    }
  })
};

/**
 * Request handler for recruitment page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */

exports.getRecruitment = function (req, res) {
  var method = '[getRecruitment]';
  logger.info(method, 'request received to get recruitment by id');
  var rid = req.params.rid;
  logger.info('try to find recruitment by id, recruitment id: ' + rid);
  recruitmentProxy.findById(rid).then(function (recruitment) {
    if (recruitment) {
      logger.info(method, 'recruitment found');
      logger.info(method, recruitment);
      logger.info(method, 'render recruitment page with the found recruitment');
      resUtil.render(req, res, 'recruitment', {
        'title': '我的IT合伙人',
        'recruitment': recruitment
      });
    } else {
      logger.info(method, 'recruitment not found, rid: ' + rid);
      resUtil.render(req, res, 'error', {
        'error': {
          'title': '您访问的资源不存在'
        }
      });
    }
  }).fail(function (err) {
    logger.error(method, 'error occur when try to find recruitment by id, rid id: ' + rid + ' , will response with bellow error');
    logger.error(method, err);
    resUtil.render(req, res, 'error', err);
  });
};

/**
 * Request handler for user home - my recruitment list page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.myRecruitments = function (req, res) {
  logger.info('request receive to user home - my recruitment list page, requester email: ' + reqUtil.getUserEmail(req));
  var requesterUid = reqUtil.getUserId(req);
  logger.info('try to find all the recruitments created by requester');
  recruitmentProxy.find({
    'creator': requesterUid
  }).then(function (recruitments) {
    logger.info('recruitments found');
    logger.debug(recruitments);
    if (req.accepts('html')) {
      logger.debug('request accept html type, will render user_home_recruitments page and response html');
      resUtil.render(req, res, 'user_home_recruitments', {
        'title': '我的IT合伙人',
        'recruitments': recruitments
      });
    } else {
      logger.debug('request NOT accept html, will response json');
      res.json(recruitments);
    }
  }).fail(function (err) {
    logger.error('bellow error occur');
    logger.error(err);
    logger.debug('will render error page');
    resUtil.render(req, res, 'error', err);
  });
};

/**
 * Request handler for user home - recruitment edit page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.recruitmentEdit = function (req, res) {
  logger.info('request receive to user home - recruitment edit');
  var rid = req.params.rid;
  var requesterUid = reqUtil.getUserId(req);
  logger.info('recruitment id: ' + rid);
  logger.info('requestor id: ' + rid);

  Q.all([
    recruitmentProxy.findById(rid),
    projectProxy.findProjectsByCreatorUid(requesterUid)
  ]).then(function (result) {
    logger.info(result);
    resUtil.render(req, res, 'user_home_recruitment_edit', {
      'title': '我的IT合伙人',
      'recruitment': result[0],
      'projects': result[1]
    });
  }).fail(function (err) {
    logger.error('bellow error occur');
    logger.error(err);
    logger.debug('will render error page');
    resUtil.render(req, res, 'error', err);
  });
};

/**
 * Request handler for recruitment update
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.updateRecruitment = function (req, res) {
  logger.info('request received to update recruitment');
  var rid = req.params.rid;
  var update = req.body;
  logger.info('try to find and replace recruitment with the update, rid: ' + rid);
  recruitmentProxy.updateById(rid, update).then(function (recruitment) {
    logger.info('update complete, will response with the updated recruitment');
    res.json(recruitment);
  }).fail(function (err) {
    logger.error('failed to replace recruitment due to bellow error');
    logger.error(err);
    logger.debug('will reponse with the error');
    res.status(500).json(err);
  });
};

/**
 * Request handler for recruitment delete
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.deleteRecruitment = function (req, res) {
  var rid = req.params.rid;
  logger.info('try to find and delete recruitment, rid: ' + rid);
  recruitmentProxy.deleteById(rid).then(function () {
    logger.info('recruitment deleted, rid: ' + rid);
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
  });
};