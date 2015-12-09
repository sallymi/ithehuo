/**
 * Friend request document operation module
 *
 * @module persistent/proxy/request
 *
 */
var Q = require('q');
var Request = require('../model/request');
var logger = require('../../utils/log').getLogger('persistent/proxy/request.js');

/**
 * Create friend request
 *
 * @function
 * @param {Request} request - request to be created
 * @return {Promise} promise to create friend request:
 * <li>succeeded: resolve with the created friend request
 * <li>failed: reject with error
 *
 */
exports.create = function (requestToCreate) {
  return Q.Promise(function (resolve, reject) {
    Request.create(requestToCreate, function (err, requestCreated) {
      if (err) {
        reject(err);
      } else {
        resolve(requestCreated);
      }
    });
  });
};

/**
 * find friend requests
 *
 * @function
 * @param {Object} filter - filter to find requests
 * @return {Promise} promise to find friend requests:
 * <li>succeeded: resolve with the found friend requests
 * <li>failed: reject with error
 *
 */
exports.find = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Request
      .find(filter)
      .populate('requestor target')
      .exec(function (err, requests) {
        if (err) {
          reject(err);
        } else {
          resolve(requests);
        }
      });
  });
};

/**
 * find friend request by id
 *
 * @function
 * @param {String} id - request id
 * @return {Promise} promise to find friend request:
 * <li>succeeded: resolve with the found friend request
 * <li>failed: reject with error
 *
 */
exports.findById = function (rid) {
  return Q.Promise(function (resolve, reject) {
    Request
      .findById(rid)
      .populate('requestor target')
      .exec(function (err, requests) {
        if (err) {
          reject(err);
        } else {
          resolve(requests);
        }
      });
  });
};

/**
 * find friend request by id
 *
 * @function
 * @param {Object} filter - filter to find request
 * @param {Object} update - request update
 * @return {Promise} promise to find friend request:
 * <li>succeeded: resolve with the found friend request
 * <li>failed: reject with error
 *
 */
exports.findOneAndUpdate = function (filter, update) {
  return Q.Promise(function (resolve, reject) {
    Request
      .findOneAndUpdate(filter, { $set : update })
      .populate('requestor target')
      .exec(function (err, requests) {
        if (err) {
          reject(err);
        } else {
          resolve(requests);
        }
      });
  });
};

/**
 * find friend requests by requestor id and target id
 *
 * @function
 * @param {String} requestorId - requestor user id
 * @param {String} targetId - target user id
 * @return {Promise} promise to find friend requests:
 * <li>succeeded: resolve with the found friend request / undefined
 * <li>failed: reject with error
 *
 */
exports.findByReqestorAndTarget = function (requestorId, targetId) {
  return Q.Promise(function (resolve, reject) {
    Request
      .find({
        'requestor': requestorId,
        'target': targetId
      })
      .sort({creation_time: -1})
      .populate('requestor target')
      .exec(function (err, request) {
        if (err) {
          reject(err);
        } else {
          resolve(request);
        }
      });
  });
};

exports.findByTarget = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Request
      .count(filter)
      .exec(function (err, count) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(count);
        }
      });
  });
};

/**
 * update friend request by id
 *
 * @function
 * @param {String} rid - request id
 * @param {JSON} update - request update
 * @return {Promise} promise to find and update friend request:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with error
 *
 */
exports.updateById = function (rid, update) {
  return Q.Promise(function (resolve, reject) {
    Request
      .update({ '_id': rid }, { $set : update })
      .populate('requestor target')
      .exec(function (err, request) {
        if (err) {
          reject(err);
        } else {
          resolve(request);
        }
      });
  });
};
