/**
 * Recruitment document operation module
 *
 * @module persistent/proxy/recruitment
 *
 */
var Recruitment = require('../model/recruitment');
var Q = require('q');
var logger = require('../../utils/log').getLogger('persistent/proxy/recruitment.js');

/**
 * Create a new recruitment
 *
 * @function
 * @param {Object} recruitment - recruitment object
 * @return {Promise} promise to create a new recruitment:
 * <li>success: resolve with the created recruitment
 * <li>failed: reject with the error
 *
 */
exports.createRecruitment = function (recruitment) {
  return Q.Promise(function (resolve, reject) {
    var newRec = new Recruitment(recruitment);
    newRec.save(function (err, rec) {
      if (err) {
        reject(err);
      } else {
        resolve(rec);
      }
    });
  });
};

/**
 * Find recruitments with a filter
 * will return all if no filter if provided
 *
 * @function
 * @param {JSON} filter - query filter
 * @return {Promise} promise to find all recruitments:
 * <li>success: resolve with the found recruitment
 * <li>failed: reject with the error
 *
 */
exports.find = function (filter) {
  if (!filter) {
    filter = { 'status': { $ne: 'deleted'} };
  } else if (!filter.status || (filter.status === 'deleted')) {
    filter.status = { $ne: 'deleted'};
  }
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to find recruitments, filter: ' + JSON.stringify(filter));
    Recruitment.
      find(filter).
      populate('project').
      sort({creation_time: -1}).
      exec().
      then(function (recruitments) {
        logger.debug('recruitments found');
        logger.trace(recruitments);
        logger.debug('will resolve with the found recruitments');
        resolve(recruitments);
      }, function (err) {
        logger.error('bellow error occur when try to find all recruitments');
        logger.error(err);
        logger.debug('will reject with the error');
        reject(err);
      });
  });
};


/**
 * Find recruitments with a filter & page & limit
 * will return all if no filter if provided
 *
 * @function
 * @param {JSON} filter - query filter
 * @return {Promise} promise to find all recruitments:
 * <li>success: resolve with the found recruitment
 * <li>failed: reject with the error
 *
 */
exports.findLimit = function (filter) {
  if (!filter) {
    filter = { 'status': { $ne: 'deleted'} };
  } else if (!filter.status || (filter.status === 'deleted')) {
    filter.status = { $ne: 'deleted'};
  }
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to find recruitments, filter: ' + JSON.stringify(filter));
    
    var page = filter.page?parseInt(filter.page):1;
    var limit = filter.limit?parseInt(filter.limit):9;
    delete filter.page;
    delete filter.limit;

    Recruitment.
      find(filter).
      populate('project').
      sort({creation_time: -1}).
      skip((page-1)*limit).
      limit(limit).
      exec().
      then(function (recruitments) {
        logger.debug('recruitments found');
        logger.trace(recruitments);
        logger.debug('will resolve with the found recruitments');
        resolve(recruitments);
      }, function (err) {
        logger.error('bellow error occur when try to find all recruitments');
        logger.error(err);
        logger.debug('will reject with the error');
        reject(err);
      });
  });
};

/**
 * Find recruitment by id
 *
 * @function
 * @param {String} rid - recruitment id
 * @return {Promise} promise to find recruitment:
 * <li>found: resolve with the found recruitment
 * <li>not found: resolve with null
 * <li>failed to execute find action: reject with the error
 *
 */
exports.findById = function (rid) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to find recruitment by id, recruitment id: ' + rid);
    Recruitment.
      findById(rid).
      populate('project').
      exec().
      then(function (recruitment) {
        if (recruitment && recruitment.status !== 'deleted') {
          logger.debug('recruitment found');
          logger.trace(recruitment);
          logger.debug('will resolve with the found recruitment');
          resolve(recruitment);
        } else {
          logger.debug('recruitment not found, will resovle with undefine');
          resolve();
        }
      }, function (err) {
        logger.error('bellow error occur when try to find recruitment by id');
        logger.error(err);
        logger.debug('will reject with the error');
        reject(err);
      });
  });
};

/**
 * Replace recruitment by id
 *
 * @function
 * @param {String} rid - recruitment id
 * @param {JSON} update - recruitment update
 * @return {Promise} promise to find and replace the recruitment:
 * <li>success: resolve with the updated recruitment
 * <li>failed: reject with the error
 *
 */
exports.updateById = function (rid, update) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try to find and replace recruitment, recruitment id: ' + rid + ' ,update recruitment content: ');
    logger.debug(update);
    Recruitment.findByIdAndUpdate(rid, update).exec().then(
      function (recruitment) {
        logger.debug('update complete, will resolve with the updated recruitment');
        logger.debug(recruitment);
        resolve(recruitment);
      },
      function (err) {
        logger.error('error occur when try to replace recruitment, recruitment id: ' + rid + ' ,will reject with bellow error');
        logger.error(err);
        reject(err);
      }
    );
  });
};

/**
 * Search recruitment
 *
 * @function
 * @param {String} key - search key word
 * @return {Promise} promise to perform a search action:
 * <li>success: resolve with the match recruitments
 * <li>failed: reject with the error
 *
 */
exports.search = function (key) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try search recruitment, key word: ' + key);
    var pattern = new RegExp(key);
    Recruitment.
      find({
      $or: [
        { 'classify': { $regex: pattern, $options: "i" } },
        { 'fulltime': { $regex: pattern, $options: "i" } },
        { 'keyword': { $regex: pattern, $options: "i" } },
        { 'description': { $regex: pattern, $options: "i" } },
        { 'location': { $regex: pattern, $options: "i" } }
      ]
    }).
      populate('project').
      sort({creation_time: -1}).
      exec().
      then(function (recruitments) {
        logger.debug('search complete, will resolve with the match recruitments');
        logger.debug(recruitments);
        logger.debug('will resolve with the found recruitments');
        resolve(recruitments);
      }, function (err) {
        logger.error('bellow error occur when try to search recruitments');
        logger.error(err);
        logger.debug('will reject with the error');
        reject(err);
      });
    // Recruitment.find({
    //   $or: [
    //     { 'classify': { $regex: pattern, $options: "i" } },
    //     { 'fulltime': { $regex: pattern, $options: "i" } },
    //     { 'keyword': { $regex: pattern, $options: "i" } },
    //     { 'description': { $regex: pattern, $options: "i" } },
    //     { 'location': { $regex: pattern, $options: "i" } }
    //   ]
    // }).exec().then(
    //   function (recruitments) {
    //     logger.debug('search complete, will resolve with the match recruitments');
    //     logger.debug(recruitments);
    //     resolve(recruitments);
    //   },
    //   function (err) {
    //     logger.error('error occur when try to search project');
    //     logger.error(err);
    //     reject(err);
    //   }
    // );
  });
};

/**
 * Delete recruitment by id
 *
 * @function
 * @param {String} rid - recruitment id
 * @return {Promise} promise to find and delete the recruitment:
 * <li>success: resolve with undefined
 * <li>failed: reject with the error
 *
 */
exports.deleteById = function (rid) {
  return Q.Promise(function (resolve, reject) {
    Recruitment.update({
      '_id': rid
    }, {
      $set: { 'status': 'deleted' }
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};