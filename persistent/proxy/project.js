/**
 * Project document operation module
 *
 * @module persistent/proxy/project
 *
 */
var Project = require('../model/project');
var Q = require('q');
var logger = require('../../utils/log').getLogger('persistent/proxy/project.js');

/**
 * Create a new project
 *
 * @function
 * @param {Object} project - project object
 * @return {Promise} promise to create a new project:
 * <li>success: resolve with the created project
 * <li>failed: reject with the error
 *
 */
exports.createProject = function (project) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to create project');
    var pro = new Project(project);
    pro.save(function (err, p) {
      if (err) {
        logger.error('bellow error occur when try to create project, will reject with the error');
        logger.error(err);
        reject(err);
      } else {
        logger.debug('bellow project created, will response the newly create project');
        logger.debug(p);
        resolve(p);
      }
    });
  });
};

/**
 * Find projects with a filter
 * will return all if no filter is provided
 *
 * @function
 * @param {JSON} filter - query filter
 * @return {Promise} promise to find all projects:
 * <li>success: resolve with the found projects
 * <li>failed: reject with the error
 *
 */
exports.findProjects = function (filter) {
  var method = '[findProjects]';
  return Q.Promise(function (resolve, reject) {
    logger.debug(method, 'try to find projects');
    logger.debug(method, 'filter: ' + JSON.stringify(filter));
    Project.
      find(filter).
      sort({creation_time: -1}).
      exec().
      then(function (projects) {
        logger.debug(method, projects.length + ' projects found');
        logger.trace(method, projects);
        logger.debug(method, 'will resolve with the found projects');
        resolve(projects);
      }, function (err) {
        logger.error(method, 'bellow error occur when try to find all projects');
        logger.error(err);
        logger.debug(method, 'will reject with the error');
        reject(err);
      });
  });
};


/**
 * Find projects with a filter & page & limit
 * will return all if no filter is provided
 *
 * @function
 * @param {JSON} filter - query filter
 * @return {Promise} promise to find all projects:
 * <li>success: resolve with the found projects
 * <li>failed: reject with the error
 *
 */
exports.findProjectsLimit = function (filter) {
  var method = '[findProjects]';
  return Q.Promise(function (resolve, reject) {
    logger.debug(method, 'try to find projects');
    logger.debug(method, 'filter: ' + JSON.stringify(filter));

    var page = filter.page?parseInt(filter.page):1;
    var limit = filter.limit?parseInt(filter.limit):9;
    delete filter.page;
    delete filter.limit;

    Project.
      find(filter).
      sort({creation_time: -1}).
      skip((page-1)*limit).
      limit(limit).
      exec().
      then(function (projects) {
        logger.debug(method, projects.length + ' projects found');
        logger.trace(method, projects);
        logger.debug(method, 'will resolve with the found projects');
        resolve(projects);
      }, function (err) {
        logger.error(method, 'bellow error occur when try to find all projects');
        logger.error(err);
        logger.debug(method, 'will reject with the error');
        reject(err);
      });
  });
};

/**
 * Find project by id
 *
 * @function
 * @param {String} pid - project id
 * @return {Promise} promise to find project:
 * <li>found: resolve with the found project
 * <li>not found: resolve with undefined
 * <li>failed to execute find action: reject with the error
 *
 */
exports.findProjectById = function (pid) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to find project by id, project id: ' + pid);
    Project
      .findById(pid)
      .populate('creator.user')
      .exec()
      .then(function (project) {
        if (project) {
          logger.debug('project found');
          logger.trace(project);
          logger.debug('will resolve with the found project');
          resolve(project);
        } else {
          logger.debug('project not found, will resolve with undefined');
          resolve();
        }
      }, function (err) {
        logger.error('bellow error occur when try to find project by id');
        logger.error(err);
        logger.debug('will reject with the error');
        reject(err);
      });
  });
};

/**
 * Find projects by status
 *
 * @function
 * @param {String} status - project status
 * @return {Promise} promise to find projects:
 * <li>found: resolve with the found project
 * <li>failed to execute find action: reject with the error
 *
 */
exports.findProjectsByStatus = function (status) {
  return Q.Promise(function (resolve, reject) {
    Project.find({
      'status': status
    }).exec().then(function (projects) {
      resolve(projects);
    }, function (err) {
      reject(err);
    });
  });
};

/**
 * Find projects by stage
 *
 * @function
 * @param {String} stage - project stage
 * @return {Promise} promise to find projects:
 * <li>found: resolve with the found project
 * <li>failed to execute find action: reject with the error
 *
 */
exports.findProjectsByStage = function (stage) {
  return Q.Promise(function (resolve, reject) {
    Project.find({
      'stage': stage
    }).exec().then(function (projects) {
      resolve(projects);
    }, function (err) {
      reject(err);
    });
  });
};

/**
 * Find projects by tag
 *
 * @function
 * @param {String} tag - project tag
 * @return {Promise} promise to find projects:
 * <li>found: resolve with the found project
 * <li>failed to execute find action: reject with the error
 *
 */
exports.findProjectsByTag = function (tag) {
  return Q.Promise(function (resolve, reject) {
    Project.find({
      'tag': tag
    }).exec().then(function (projects) {
      resolve(projects);
    }, function (err) {
      reject(err);
    });
  });
};

/**
 * Find projects by creator uid
 *
 * @function
 * @param {String} uid - creator uid
 * @return {Promise} promise to find projects created by the creator:
 * <li>success: resolve with the found projects
 * <li>failed: reject with the error
 *
 */
exports.findProjectsByCreatorUid = function (uid) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to find projects by creator uid, uid: ' + uid);
    Project.find().where('creator.user').equals(uid).exec().then(function (projects) {
      logger.debug('projects found');
      logger.trace(projects);
      logger.debug('will resolve with the found projects');
      resolve(projects);
    }, function (err) {
      logger.error('bellow error occur when try to find projects by creator uid');
      logger.error(err);
      logger.debug('will reject with the error');
      reject(err);
    });
  });
};

/**
 * Find hot projects
 *
 * @function
 * @return {Promise} promise to find all hot projects
 * <li>success: resolve with the found projects
 * <li>failed: reject with the error
 *
 */
exports.findHotProjects = function () {
  return Q.Promise(function (resolve, reject) {
    Project.find({
      'hot': true
    }).exec().then(function (projects) {
      resolve(projects);
    }, function (err) {
      logger.error(err);
      reject(err);
    });
  });
};

/**
 * Find recommended projects
 *
 * @function
 * @return {Promise} promise to find all recommended projects
 * <li>success: resolve with the found projects
 * <li>failed: reject with the error
 *
 */
exports.findRecommendedProjects = function () {
  return Q.Promise(function (resolve, reject) {
    Project.find({
      'recommended': true
    }).exec().then(function (projects) {
      resolve(projects);
    }, function (err) {
      logger.error(err);
      reject(err);
    });
  });
};
/**
 * Replace project by id
 *
 * @function
 * @param {String} pid - project id
 * @param {JSON} update - project update
 * @return {Promise} promise to find and replace the project with the update:
 * <li>success: resolve with the updated project
 * <li>failed: reject with the error
 *
 */
exports.replaceProjectById = function (pid, update) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to update project, project id: ' + pid + ' ,update project content: ');
    logger.debug(update);
    Project.findByIdAndUpdate(pid, update).exec().then(
      function (project) {
        logger.debug('update complete, will resolve with the updated project');
        logger.debug(project);
        resolve(project);
      },
      function (err) {
        logger.error('error occur when try to replace project by id, project id: ' + pid + ' ,will reject with bellow error');
        logger.error(err);
        reject(err);
      }
    );
  });
};

/**
 * Update project hot filed
 *
 * @function
 * @param {String} pid - project id
 * @param {Boolean} value
 * @return {Promise} promise to update the hot filed
 * <li>success: resolve with undefined
 * <li>failed: reject with the error
 *
 */
exports.updateHot = function (pid, value) {
  return Q.Promise(function (resolve, reject) {

    if (typeof value !== 'boolean') {
      reject(new Error('value type must be boolean'));
    }

    Project.update({
      '_id': pid
    }, {
      $set: {
        'hot': value
      }
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Update project recommended filed
 *
 * @function
 * @param {String} pid - project id
 * @param {Boolean} value
 * @return {Promise} promise to update the recommended filed
 * <li>success: resolve with undefined
 * <li>failed: reject with the error
 *
 */
exports.updateRecommended = function (pid, value) {
  return Q.Promise(function (resolve, reject) {

    if (typeof value !== 'boolean') {
      reject(new Error('value type must be boolean'));
    }

    Project.update({
      '_id': pid
    }, {
      $set: {
        'recommended': value
      }
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Save project
 *
 * @function
 * @param {Project Model} project - project to be saved
 * @return {Promise} promise to save the project:
 * <li>project saved: resolve with the saved project
 * <li>error occur during save: reject with error
 *
 */
exports.saveProject = function (project) {
  return Q.Promise(function (resolve, reject) {
    project.save(function (err, project) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(project);
      }
    });
  });
};

/**
 * Search project
 *
 * @function
 * @param {String} key - search key word
 * @return {Promise} promise to perform a search action:
 * <li>success: resolve with the match projects
 * <li>failed: reject with the error
 *
 */
exports.search = function (key) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try search project, key word: ' + key);
    var pattern = new RegExp(key);
    Project.find({
      $or: [
        { 'name': { $regex: pattern, $options: "i" } },
        { 'keyword': { $regex: pattern, $options: "i" } },
        { 'description': { $regex: pattern, $options: "i" } }
      ]
    }).exec().then(
      function (projects) {
        logger.debug('search complete, will resolve with the match projects');
        logger.debug(projects);
        resolve(projects);
      },
      function (err) {
        logger.error('error occur when try to search project');
        logger.error(err);
        reject(err);
      }
    );
  });
};