/**
 * Question document operation module
 *
 * @module persistent/proxy/question
 *
 */
var User = require('../model/user');
var Question = require('../model/question');
var Tag = require('../model/tag');
var Q = require('q');
var logger = require('../../utils/log').getLogger('persistent/proxy/question.js');

/**
 * Find questions
 *
 * @function
 * @param {Object} filter - query filters
 * @param {String} sortBy - result sort
 * @return {Promise} promise to find all questions:
 * <li> succeed: resolve with questions array
 * <li> failed: reject with error
 *
 */
exports.findQuestions = function (filter, sortBy) {
  var sortKey = sortBy || '-created_at';
  return Q.Promise(function (resolve, reject) {
    Question
      .find(filter)
      .populate('best_answer')
      .populate('created_by comment.created_by', 'name email logo_img')
      .populate('tag', 'title')
      .select('title content created_by created_at tag best_answer anonymous comment')
      .sort(sortKey)
      .exec(function (err, questions) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(questions);
        }
      });
  });
};

/**
 * Find question by id
 *
 * @function
 * @param {String} qid - question id
 * @return {Promise} promise to perform a find action:
 * <li>question found: resolve with question
 * <li>question not found: resolve with null
 * <li>error occur during find: reject with error
 *
 */
exports.findQuestionById = function (qid) {
  return Q.Promise(function (resolve, reject) {
    Question
      .findById(qid)
      .populate('best_answer')
      .populate('created_by comment.created_by', 'name email logo_img')
      .populate('tag', 'title')
      .exec(function (err, question) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          if (question) {
            resolve(question);
          } else {
            resolve();
          }
        }
      });
  });
};

/**
 * Save question
 *
 * @function
 * @param {Question} question - question to be saved
 * @return {Promise} promise to save the question:
 * <li>question saved: resolve with the saved question
 * <li>error occur during save: reject with error
 *
 */
exports.saveQuestion = function (question) {
  return Q.Promise(function (resolve, reject) {
    var questionToSave = new Question(question);
    questionToSave.save(function (err, question) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(question);
      }
    });
  });
};

/**
 * Update question
 *
 * @function
 * @param {String} qid - question id to be updated
 * @param {String} title - new question title
 * @param {String} content - new question content
 * @return {Promise} promise to update the question:
 * <li>question updated: resolve with the effected
 * <li>error occur during save: reject with error
 *
 */
exports.updateQuestion = function (qid, title, content) {
  return Q.Promise(function (resolve, reject) {
    Question
      .update(
        {'_id': qid },
        { '$set': {'title': title, 'content': content}}
      )
      .exec(function (err, updated) {
        if (err) {
          reject(err);
        } else {
          resolve({'effected': updated});
        }
      });
  });
};

/**
 * Save comment
 *
 * @function
 * @param {ObjectId} qid - question id
 * @param {Comment} comment - comment to be saved
 * @return {Promise} promise to save the comment:
 * <li>comment saved: resolve with undefined
 * <li>error occur during save: reject with error
 *
 */
exports.saveComment = function (qid, comment) {
  return Q.Promise(function (resolve, reject) {
    Question.update({'_id': qid},
      {
        '$addToSet': { 'comment': comment},
      })
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
 * Update comment
 *
 * @function
 * @param {String} qid - question id
 * @param {String} cid - comment id
 * @param {String} content - comment content
 * @return {Promise} promise to update the comment:
 * <li>comment saved: resolve with undefined
 * <li>error occur during update: reject with error
 *
 */
exports.updateComment = function (qid, cid, content) {
  return Q.Promise(function (resolve, reject) {
    Question
      .update(
        { '_id': qid, 'comment._id': cid },
        { '$set': { 'comment.$.content': content } }
      )
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
 * Delete comment
 *
 * @function
 * @param {String} qid - question id
 * @param {String} cid - comment id
 * @return {Promise} promise to delete the comment:
 * <li>comment saved: resolve with undefined
 * <li>error occur during delete: reject with error
 *
 */
exports.deleteComment = function (qid, cid) {
  return Q.Promise(function (resolve, reject) {
    Question.update({'_id': qid},
      {
        '$pull': { 'comment': {'_id': cid}},
      })
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
 * Mark best answer
 *
 * @function
 * @param {String} qid - question id
 * @param {String} aid - answer id
 * @return {Promise} promise to set the answer as the best answer:
 * <li>answer set: resolve with undefined
 * <li>error occur during save: reject with error
 *
 */
exports.markBestAnswer = function (qid, aid) {
  return Q.Promise(function (resolve, reject) {
    Question
      .update(
        {'_id': qid},
        {'$set': {'best_answer': aid}}
      )
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
 * Cancel best answer
 *
 * @function
 * @param {String} qid - question id
 * @return {Promise} promise to cancel the answer as the best answer:
 * <li>answer set: resolve with undefined
 * <li>error occur during save: reject with error
 *
 */
exports.cancelBestAnswer = function (qid) {
  return Q.Promise(function (resolve, reject) {
    Question
      .update(
        {'_id': qid},
        { '$unset': {'best_answer': ''}}
      )
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
* inc view times of a question
*/
// exports.countViewQuestion = function (qid, count) {
//   return Q.Promise(function (resolve, reject) {
//     Question.update(
//       {'_id': qid},
//       { '$inc': {'views': count}},
//       function (err, updated) {
//         if (err) {
//           reject(err);
//         } else {
//           resolve({'effected': updated});
//         }
//       }
//     );
//   });
// };

/**
 * Delete question
 *
 * @function
 * @param {String} id - question id
 * @return {Promise} promise to delete the question
 * <li>success: resolve with undefined
 * <li>failed: reject with the error
 *
 */
exports.deleteQuestion = function (id) {
  return Q.Promise(function (resolve, reject) {
    Question.remove({ '_id': id }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Search questions
 *
 * @function
 * @param {String} key - search key word
 * @return {Promise} promise to perform a search action:
 * <li>success: resolve with the match questions
 * <li>failed: reject with the error
 *
 */
exports.search = function (key) {
  return Q.Promise(function (resolve, reject) {
    logger.debug('try search questions, key word: ' + key);
    var pattern = new RegExp(key);
    Question.
      find({
        $or: [
          { 'title': { $regex: pattern, $options: 'i' } },
          { 'content': { $regex: pattern, $options: 'i' } }
        ]
      }).
      exec().
      then(
        function (recruitments) {
          logger.debug('search complete, will resolve with the match recruitments');
          logger.debug(recruitments);
          resolve(recruitments);
        },
        function (err) {
          logger.error('error occur when try to search project');
          logger.error(err);
          reject(err);
        }
      );
  });
};