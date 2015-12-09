/**
 * Handle project requests
 *
 * @module biz/project
 *
 */
var Q = require('q');
var filters = require('../config.js').filters.projects;
var Project = require('../persistent/model/project.js');
var projectProxy = require('../persistent/proxy/project.js');
var recruitmentProxy = require('../persistent/proxy/recruitment');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var dataUtil = require('../utils/data');
var filterUtil = require('../utils/filter');
var logger = require('../utils/log').getLogger('biz/project.js');

/**
 * Request handler to new project page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.newProject = function (req, res) {
  resUtil.render(req, res, 'project_new');
};

/**
 * Request handler to project list page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getProjects = function (req, res) {
  logger.info('request received to project list page');
  logger.info('filter: ' + JSON.stringify(req.query));

  // get projects by differents filtes
  var promiseToGetProjects;

  if (req.query.recruitment) {
    // handle recruitment filter
    promiseToGetProjects =  Q.Promise(function (resolve, reject) {
      recruitmentProxy.find({
        'classify': req.query.recruitment
      }).then(function (recruitments) {
        var projects = [];
        var i;
        for (i = 0; i < recruitments.length; i++) {
          projects[i] = recruitments[i].project;
        }
        resolve(projects);
      }).fail(function (err) {
        reject(err);
      });
    });
  } else {
    // handle common filter
    var filter = filterUtil.toMongoFilter(req.query);
    promiseToGetProjects = projectProxy.findProjects(filter);
  }

  promiseToGetProjects.then(function (projects) {
    return Q.Promise(function (resolve, reject) {
      var promises = [];
      var i, project;
      for (i = 0; i < projects.length; i++) {
        project = projects[i];
        promises.push(recruitmentProxy.find({
          'project': project.id
        }));
      }
      Q.all(promises).then(function (recruitments) {
        var j;
        for (j = 0; j < projects.length; j++) {
          projects[j].recruitments = recruitments[j];
        }
        resolve(projects);
      }).fail(function (err) {
        reject(err);
      });
    });
  }).then(function (projects) {
    logger.info('find complete');
    logger.info('will render projects page with bellow projects');
    logger.info(projects);
    resUtil.render(req, res, 'projects', {
      'projects': projects,
      'filters': filters,
      'searchType': 'project'
    });
  }).fail(function (err) {
    logger.error('error occur when try to find all the projects, see bellow error');
    logger.error(err);
    logger.debug('will render error page');
    resUtil.render(req, res, 'error', err);
  });
};

/**
 * Request handler to project detail page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getProject = function (req, res) {
  var method = '[getProject]';
  var pid = req.params.pid;
  logger.info(method, 'request received to find project by id: ' + pid);

  Q.all([
    projectProxy.findProjectById(pid),
    recruitmentProxy.find({'project': pid})
  ]).spread(function (project, recruitments) {
    logger.info(method, 'find complete');

    if (req.accepts('html')) {
      logger.info(method, 'request accept html type, will render project page');
      resUtil.render(req, res, 'project', {
        'project': project,
        'recruitments': recruitments,
        'searchType': 'project'
      });
    } else {
      logger.info(method, 'request NOT accept html type, will response json');
      res.json(project);
    }
  }).fail(function (err) {
    logger.error(err);
    res.status(500).json(err);
    res.end();
  });
};

/**
 * Request handler to create a new project
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createProject = function (req, res) {
  logger.info('request received to create project, bellow is the request body');
  var project = req.body;
  logger.info(project);
  projectProxy.createProject(project).then(function (pro) {
    logger.info('bellow project created, will response with the project');
    logger.info(pro);
    res.json(pro);
  }).fail(function (err) {
    logger.error('error occur when try to create project, will response with the error');
    logger.error(err);
    res.status(500).json(err);
  });
};

/**
 * Request handler for project update
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.updateProject = function (req, res) {
  logger.info('request received to update project');
  var pid = req.params.pid;
  var update = req.body;
  logger.info('try to find and replace project, pid: ' + pid);
  projectProxy.replaceProjectById(pid, update).then(function (project) {
    logger.info('update complete, will response with the updated project');
    res.json(project);
  }).fail(function (err) {
    logger.error('failed to update project due to bellow error');
    logger.error(err);
    logger.debug('will reponse with the error');
    res.status(500).json(err);
  });
};

/**
 * Request handler for user home - user projet list page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.myProjects = function (req, res) {
  logger.info('request receive to user home - project list page, requester email: ' + reqUtil.getUserEmail(req));
  var requesterUid = reqUtil.getUserId(req);
  logger.info('try to find all the projects created by requester');
  projectProxy.findProjectsByCreatorUid(requesterUid).then(function (projects) {
    logger.info('projects found');
    logger.debug(projects);
    logger.info('will render user_home_projects page');
    if (req.accepts('html')) {
      logger.debug('request accept html type, will render projects page and response html');
      resUtil.render(req, res, 'user_home_projects', {
        'title': '我的IT合伙人',
        'projects': projects
      });
    } else {
      logger.debug('request NOT accept html, will response json');
      res.json(projects);
    }

  }).fail(function (err) {
    logger.error('bellow error occur');
    logger.error(err);
    logger.debug('will render error page');
    resUtil.render(req, res, 'error', err);
  });
};

/**
 * Request handler for user home - projet edit page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.projectEdit = function (req, res) {
  logger.info('request receive to user home - project edit');
  var pid = req.params.pid;
  logger.info('try to find the target project, pid: ' + pid);
  projectProxy.findProjectById(pid).then(function (project) {
    logger.info('project found');
    logger.debug(project);
    logger.info('will render project_edit page with the found project');
    resUtil.render(req, res, 'user_home_project_edit', {
      'title': '我的IT合伙人',
      'project': project.toObject()
    });
  }).fail(function (err) {
    logger.error('bellow error occur');
    logger.error(err);
    logger.debug('will render error page');
    resUtil.render(req, res, 'error', err);
  });
};
