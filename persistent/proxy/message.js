/**
 * Message document operation module
 *
 * @module persistent/proxy/message
 *
 */
var Q = require('q');
var Message = require('../model/message');
var logger = require('../../utils/log').getLogger('persistent/proxy/message.js');

/**
 * Create a new message
 *
 * @function
 * @param {String} senderId - sender id
 * @param {String} receiverId - receiver id
 * @param {String} msg - message content
 * @return {Promise} promise to create a new message:
 * <li>succeeded: resolve with the created message
 * <li>failed: reject with the error
 *
 */
exports.create = function (senderId, receiverId, msg) {
  return Q.Promise(function (resolve, reject) {
    Message.create({
      'from': senderId,
      'to': receiverId,
      'msg': msg
    }, function (err, message) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(message);
      }
    });
  });
};

/**
 * Find messages
 *
 * @function
 * @param {Object} filter - message filter
 * @return {Promise} promise to find messages:
 * <li>succeeded: resolve with the found messages
 * <li>failed: reject with the error
 *
 */
exports.find = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Message
      .find(filter)
      .populate('from to', 'name email logo_img')
      .exec(function (err, messages) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(messages);
        }
      });
  });
};

/**
 * Query messages count
 *
 * @function
 * @param {Object} filter - filter to get messages count
 * @return {Promise} promise to query messages count:
 * <li>succeeded: resolve with the message count number
 * <li>failed: reject with the error
 *
 */
exports.queryCount = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Message
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
 * Update message by id
 *
 * @function
 * @param {String} id - message id
 * @param {Object} update - message update
 * @return {Promise} promise to update message:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with the error
 *
 */
exports.updateById = function (id, update) {
  return Q.Promise(function (resolve, reject) {
    Message
      .update({'_id': id}, { $set: update })
      .exec(function (err) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
  });
};

/**
 * Mark messages as read
 *
 * @function
 * @param {Object} filter - message filter
 * @return {Promise} promise to update message:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with the error
 *
 */
exports.markRead = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Message
      .update(
        filter,
        { $set: { 'read': true } },
        { multi: true }
      )
      .exec(function (err,  writeResult) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(writeResult);
        }
      });
  });
};

/**
 * Delete message by id
 *
 * @function
 * @param {String} id - message id
 * @return {Promise} promise to delete message:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with the error
 *
 */
exports.removeById = function (id) {
  return Q.Promise(function (resolve, reject) {
    Message
      .remove({'_id': id})
      .exec(function (err) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
  });
};