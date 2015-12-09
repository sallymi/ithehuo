/**
 * Friend relation document operation module
 *
 * @module persistent/proxy/request
 *
 */
var Q = require('q');
var Relation = require('../model/relation');
var requestProxy = require('./request');
var logger = require('../../utils/log').getLogger('persistent/proxy/relation.js');

/**
 * Create relation by friend request
 *
 * @function
 * @param {String} rid - request id
 * @return {Promise} promise to create friend relation:
 * <li>succeeded: resolve with the created friend relation
 * <li>failed: reject with error
 *
 */
exports.createByRequest = function (rid) {
  return Q.Promise(function (resolve, reject) {
    requestProxy.findById(rid).then(function (request) {
      var relationToCreate = {
        'request': rid,
        'users': [request.requestor.id, request.target.id]
      };
      Relation.create(relationToCreate, function (err, relation) {
        if (err) {
          reject(err);
        } else {
          resolve(relation);
        }
      });
    });
  });
};

/**
 * find relations
 *
 * @function
 * @param {Object} filter - fitler to find relations
 * @return {Promise} promise to find friend relations:
 * <li>succeeded: resolve with the found friend relations
 * <li>failed: reject with error
 *
 */
exports.find = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Relation
      .find(filter)
      .populate('users request terminator')
      .exec(function (err, relations) {
        if (err) {
          reject(err);
        } else {
          resolve(relations);
        }
      });
  });
};

/**
 * find one relation
 *
 * @function
 * @param {Object} filter - fitler to find relation
 * @return {Promise} promise to find friend relation:
 * <li>succeeded: resolve with the found friend relation
 * <li>failed: reject with error
 *
 */
exports.findOne = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Relation
      .findOne(filter)
      .populate('users request terminator')
      .exec(function (err, relations) {
        if (err) {
          reject(err);
        } else {
          resolve(relations);
        }
      });
  });
};

/**
 * find relation by users
 *
 * @function
 * @param {String} uid1
 * @param {String} uid2
 * @return {Promise} promise to find friend relation:
 * <li>succeeded: resolve with the found friend relation
 * <li>failed: reject with error
 *
 */
exports.findByUsersId = function (uid1, uid2) {
  return Q.Promise(function (resolve, reject) {
    Relation
      .findOne({
        $or : [
          { 'users': [uid1, uid2] },
          { 'users': [uid2, uid1] }
        ]
      })
      .populate('users request terminator')
      .exec(function (err, relations) {
        if (err) {
          reject(err);
        } else {
          resolve(relations);
        }
      });
  });
};

/**
 * update relation by id
 *
 * @function
 * @param {String} rid - relation id
 * @param {JSON} update - relation update
 * @return {Promise} promise to find and update friend relation:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with error
 *
 */
exports.updateById = function (rid, update) {
  return Q.Promise(function (resolve, reject) {
    Relation
      .update({ '_id': rid }, { $set : update })
      .exec(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
};

/**
 * Remove relation by id
 *
 * @function
 * @param {String} rid - relation id
 * @return {Promise} promise to remove relation by id
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with error
 *
 */
exports.removeById = function (rid) {
  return Q.Promise(function (resolve, reject) {
    Relation
      .remove({ '_id': rid })
      .exec(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
};