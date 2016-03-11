/**
 * User document operation module
 *
 * @module persistent/proxy/user
 *
 */
var User = require('../model/user');
var Q = require('q');
var logger = require('../../utils/log').getLogger('persistent/proxy/user.js');

/**
 * Create a new user
 *
 * @function
 * @param user
 * @return {Promise} promise to create a new user:
 * <li>user created: resolve with the created user
 * <li>error occur during creation: reject with the error
 *
 */
exports.createUser = function (user) {
  return Q.Promise(function (resolve, reject) {
    User.create(user, function (err, u) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(u);
      }
    });
  });
};

/**
 * Find users with a filter
 *
 * @function
 * @return {Promise} promise to find all users:
 * <li> succeed: resolve with users array
 * <li> failed: reject with error
 *
 */
exports.findUsers = function (filter) {
  return Q.Promise(function (resolve, reject) {
    User
      .find(filter)
      .populate('fav_questions.question fav_answers.answer followings')
      .exec(function (err, users) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(users);
        }
      });
  });
};

/**
 * Find users with a filter & page & limit
 *
 * @function
 * @return {Promise} promise to find all users:
 * <li> succeed: resolve with users array
 * <li> failed: reject with error
 *
 */
exports.findUsersLimit = function (filter) {
  return Q.Promise(function (resolve, reject) {
    var page = filter.page?parseInt(filter.page):1;
    var limit = filter.limit?parseInt(filter.limit):9;
    delete filter.page;
    delete filter.limit;
    User
      .find(filter)
      .populate('fav_questions.question fav_answers.answer followings')
      .skip((page-1)*limit)
      .limit(limit)
      .exec(function (err, users) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(users);
        }
      });
  });
};



/**
 * Find user by email
 *
 * @function
 * @param {String} email - user email
 * @return {Promise} promise to perform a find action:
 * <li>user found: resolve with user
 * <li>user not found: resolve with undefine
 * <li>error occur during find: reject with error
 *
 */
exports.findUserByEmail = function (email) {
  return Q.Promise(function (resolve, reject) {
    User.findOne({ 'email': email })
      .populate('fav_questions.question fav_answers.answer followings')
      .exec(function (err, user) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          if (user) {
            resolve(user);
          } else {
            resolve();
          }
        }
      });
  });
};

/**
 * Find user by phone
 *
 * @function
 * @param {String} uid - user id
 * @return {Promise} promise to perform a find action:
 * <li>user found: resolve with user
 * <li>user not found: resolve with undefine
 * <li>error occur during find: reject with error
 *
 */
exports.findUserByPhone = function (phone) {
  return Q.Promise(function (resolve, reject) {
    User
      .findOne({'mobile_phone':phone})
      .populate('fav_questions.question fav_answers.answer followings')
      .exec(function (err, user) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          if (user) {
            resolve(user);
          } else {
            resolve();
          }
        }
      });
  });
};

/**
 * Find user by id
 *
 * @function
 * @param {String} uid - user id
 * @return {Promise} promise to perform a find action:
 * <li>user found: resolve with user
 * <li>user not found: resolve with undefine
 * <li>error occur during find: reject with error
 *
 */
exports.findUserById = function (uid) {
  return Q.Promise(function (resolve, reject) {
    User
      .findById(uid)
      .populate('fav_questions.question fav_answers.answer followings')
      .exec(function (err, user) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          if (user) {
            resolve(user);
          } else {
            resolve();
          }
        }
      });
  });
};

/**
 * Active user by id
 *
 * @function
 * @param {String} uid - user id
 * @return {Promise} promise to perform a find action:
 * <li>user found: resolve with user
 * <li>user not found: resolve with undefine
 * <li>error occur during find: reject with error
 *
 */
exports.updateActive = function (uid, value) {
  return Q.Promise(function (resolve, reject) {
    User
      .update(
        { '_id': uid },
        { "active": value}
      )
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
 * Save user
 *
 * @function
 * @param {User} user - user to be saved
 * @return {Promise} promise to save the user:
 * <li>user saved: resolve with the saved user
 * <li>error occur during save: reject with error
 *
 */
exports.saveUser = function (user) {
  return Q.Promise(function (resolve, reject) {
    user.save(function (err, user) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

/**
 * Add a favorite question
 *
 * @function
 * @param {String} uid - user id to add favorite question
 * @param {String} qid - question id to be added
 * @return {Promise} promise to add favorite question:
 * <li>favorite question added saved: resolve with undefined
 * <li>error occur during save: reject with error
 *
 */
exports.favQuestion = function (uid, qid) {
  return Q.Promise(function (resolve, reject) {
    User
      .update(
        { '_id': uid },
        { "$addToSet": { "fav_questions": {'question': qid} }}
      )
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
 * Cancel a favorite question
 *
 * @function
 * @param {String} uid - user id to add cancel favorite question
 * @param {String} qid - question id to be cancelled
 * @return {Promise} promise to cancel favorite question:
 * <li>question cancelled: resolve with undefined
 * <li>error occur during save: reject with error
 *
 */
exports.cancelFavQuestion = function (uid, qid) {
  return Q.Promise(function (resolve, reject) {
    User
      .update(
        { '_id': uid },
        { "$pull": { "fav_questions": {'question': qid} }}
      )
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
 * Add a favorite answer
 *
 * @function
 * @param {String} uid - user id to add favorite answer
 * @param {String} aid - answer id to add favorite
 * @return {Promise} promise to add favorite answer:
 * <li>favorite answer added: resolve with undefined
 * <li>error occur during save: reject with error
 *
 */
exports.favAnswer = function (uid, aid) {
  return Q.Promise(function (resolve, reject) {
    User
      .update(
        { '_id': uid },
        { "$addToSet": { "fav_answers": {'answer': aid} }}
      )
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
 * Cancel a favorite answer
 *
 * @function
 * @param {String} uid - user id to cancel favorite answer
 * @param {String} aid - answer id to cancel favorite
 * @return {Promise} promise to cancel favorite answer:
 * <li>favorite answer cancelled: resolve with undefined
 * <li>error occur during cancel: reject with error
 *
 */
exports.cancelFavAnswer = function (uid, aid) {
  return Q.Promise(function (resolve, reject) {
    User
      .update(
        { '_id': uid },
        { "$pull": { "fav_answers": {'answer': aid} }}
      )
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
 * Check if user is following a target
 *
 * @function
 * @param {String} followerId - follower user id
 * @param {String} targetId - target user id
 * @return {Promise} promise to cancel favorite answer:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with error
 *
 */
exports.isFollowing = function (followerId, targetId) {
  return Q.Promise(function (resolve, reject) {
    User
      .findOne(
        { '_id': followerId }
      )
      .exec(function (err, follower) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          var followings = follower.followings;
          var isFollowing = false;
          var i;
          for (i = 0; i < followings.length; i++) {
            if (followings[i].toString() === targetId) {
              isFollowing = true;
              break;
            }
          }
          logger.info(isFollowing)
          resolve(isFollowing);
        }
      });
  });
};

/**
 * Add a following user
 *
 * @function
 * @param {String} followerId - follower user id
 * @param {String} targetId - target user id
 * @return {Promise} promise to cancel favorite answer:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with error
 *
 */
exports.addFollowing = function (followerId, targetId) {
  return Q.Promise(function (resolve, reject) {
    User
      .findOneAndUpdate(
        { '_id': followerId },
        { "$addToSet": { "followings": targetId }}
      )
      .exec(function (err, update) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          logger.debug(update);
          resolve(update);
        }
      });
  });
};

/**
 * Remove a following user
 *
 * @function
 * @param {String} followerId - follower user id
 * @param {String} targetId - target user id
 * @return {Promise} promise to cancel favorite answer:
 * <li>succeeded: resolve with undefined
 * <li>failed: reject with error
 *
 */
exports.removeFollowing = function (followerId, targetId) {
  return Q.Promise(function (resolve, reject) {
    User
      .findOneAndUpdate(
        { '_id': followerId },
        { "$pull": { "followings": targetId }}
      )
      .exec(function (err, update) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          logger.debug(update);
          resolve(update);
        }
      });
  });
};