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
var gm = require('gm');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
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
  //重新存储logo
  projectProxy.createProject(project).then(function (pro) {
    return Q.promise(function(resolve,reject){
      if(pro['logo_img'].indexOf('temp')!==-1){
        var sourceFile = path.resolve(__dirname,'../public'+pro['logo_img']);
        var tsName = pro['logo_img'].split("/").pop()
        var destPath = path.resolve(__dirname,'../public/images/upload_portfolio/'+pro['_id']+"_"+tsName);
        //var pRename = function(from,to){
        //  var deferred = Q.defer();
        //  fs.rename(from,to,function(err){
        //    if(err){
        //      deferred.reject(err)
        //    }else{
        //      deferred.resolve();
        //    }
        //  })
        //  return deferred.promise;
        //};
        //var pStat = function(dpath){
        //  var deferred = Q.defer();
        //  fs.stat(dpath,function(err,stats){
        //    if(err){
        //      deferred.reject(err);
        //    }else{
        //      deferred.resolve(stats);
        //    }
        //  })
        //  return deferred.promise;
        //};
        //pRename(sourceFile,destPath).then(pStat(destPath)).then(function(stats){
        //  logger.info("stats:"+JSON.stringify(stats));
        //  var newimagePath =' /images/upload_portfolio/'+pro['_id']+"_"+tsName;
        //  pro['logo_img'] = newimagePath;
        //  return projectProxy.saveProject(pro);
        //})
        fs.rename(sourceFile,destPath,function(err){
          if(err){
            logger.info("error occur when try to move the project logo,will response with the error");
            logger.info(err);
            reject(err);
          }
          fs.stat(destPath,function(err, stats) {
            if(err){
              logger.info("error occur when try to check the new file,will response with the error");
              logger.info(err);
              reject(err);
            }else{
              logger.info("stats:"+JSON.stringify(stats));
              var newimagePath =' /images/upload_portfolio/'+pro['_id']+"_"+tsName;
              pro['logo_img'] = newimagePath;
              projectProxy.saveProject(pro).then(function(p){
                resolve(p);
              });
            }
          })
        })
      }else{
        projectProxy.saveProject(pro).then(function(p){
          resolve(p);
        });
      }
    })
  }).then(function(p){
    logger.info('bellow project created, will response with the project');
    logger.info(p);
    res.json(p);
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
 * Request handler to update a user's avatar
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.updateLogo = function (req, res) {
  logger.debug('request received to update projects logo');
  var form = new formidable.IncomingForm();
  var IMG_PATH = path.resolve(__dirname,'../public/images/upload_portfolio');
  var TMP_PATH = path.resolve(__dirname,'../public/images/temp');
  form.parse(req, function(err, fields, files) {
    var width = fields.w;
    var height = fields.h;
    var x = fields.x;
    var y = fields.y;
    var W = fields.W;
    var H = fields.H;
    var pid = fields.pid;
    var imgPath = files.file.path;
    var sz = files.file.size;
    //logger.debug(fields);
    //logger.info(files.file);
    if(sz > 2*1024*1024){
      logger.debug('image is out of size')
      fs.unlink(imgPath, function() {	//fs.unlink 删除用户上传的文件
        res.json({errCode:1001,msg:'图片超出指定大小'});
      });
    } else if (files.file.type.split('/')[0] != 'image') {
      logger.debug('file is not image')
      fs.unlink(imgPath, function() {
        res.json({errCode:1002,msg:'请上传图片文件'});
      });
    } else {
      var filetype = files.file.type.split('/')[1];
      var ts = Date.now();
      if(pid){
        var src_path = '/images/upload_portfolio/'+pid+"_"+ts+"."+filetype;
        var store_path = path.resolve(IMG_PATH,pid+"_"+ts+"."+filetype)
      }else {
        src_path = '/images/temp/'+ts+'.'+filetype;
        store_path = path.resolve(TMP_PATH,ts+"."+filetype)
      }

      gm(imgPath)
          .autoOrient()
          //.resize(W>850?850:W) //加('!')强行把图片缩放成对应尺寸400*400！
          .crop(width, height, x, y)
          .write(store_path, function(err){
            if (err) {
              console.log(err);
              res.status(500).json({errCode:1003,msg:'处理图片时发生错误'});
            }
            if(pid){
              projectProxy.findProjectById(pid).then(function(project){
                logger.debug('find the project,will update the logo');
                project['logo_img'] = src_path;
                return projectProxy.saveProject(project);
              }).then(function(p){
                res.status(200).json({errCode:0,msg:'更新成功',url:src_path});
              }).fail(function(err){
                logger.error('failed to persistent the updated project due to bellow error, will render error page with the bellow error');
                logger.error(err);
                res.status(500).json({errCode:1004,msg:'保存图片时发生错误'})
              })
            }else {
              res.status(200).json({errCode:0,msg:'上传成功',url:src_path});
            }
          });
    }
  });
};
/**
 * Request handler for add project like
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.addProjectLike = function (req, res) {
  logger.info('request received to add project like');
  var pid = req.body.pid;
  logger.info('try to find the project, pid: ' + pid);
  projectProxy.addLike(pid).then(function () {
    res.json('success');
  }).fail(function (err) {
    logger.error(err);
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
