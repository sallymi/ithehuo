/**
 * Answer document operation module
 *
 * @module persistent/proxy/answer
 *
 */
// var User = require('../model/user');
// var Question = require('../model/question');
var Q = require('q');
var Answer = require('../model/answer');
// var Tag = require('../model/tag');

var logger = require('../../utils/log').getLogger('persistent/proxy/answer.js');

/**
 * Create answer
 *
 * @function
 * @param {Answer} answer - answer to be saved
 * @return {Promise} promise to save the answer:
 * <li>answer created: resolve with the saved answer
 * <li>error occur during save: reject with error
 *
 */
exports.createAnswer = function (answerToCreate) {
  return Q.Promise(function (resolve, reject) {
    Answer.create(answerToCreate, function (err, answerCreated) {
      if (err) {
        reject(err);
      } else {
        resolve(answerCreated);
      }
    });
  });
};

/**
* find answers
*
* @function
* @param filter - find filter
* @return {Promise} promise to find answers:
* <li> succeed: resolve with answers array
* <li> failed: reject with error
*/
exports.findAnswers = function (filter) {
  return Q.Promise(function (resolve, reject) {
    Answer
      .find(filter)
      .populate('question')
      .populate('created_by comment.created_by agrees.user opposes.user', 'name email logo_img')
      .exec(function (err, answers) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(answers);
        }
      });
  });
};

/**
 * Find answer by id
 *
 * @function
 * @param {String} aid - answer id
 * @return {Promise} promise to perform a find action:
 * <li>answer found: resolve with answer
 * <li>answer not found: resolve with null
 * <li>error occur during find: reject with error
 *
 */
exports.findAnswerById = function (aid) {
  return Q.Promise(function (resolve, reject) {
    Answer
      .findById(aid)
      .populate('question')
      .populate('created_by comment.created_by agrees.user opposes.user', 'name email logo_img')
      .exec(function (err, answer) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          if (answer) {
            resolve(answer);
          } else {
            resolve();
          }
        }
      });
  });
};

/**
* find answers by views
*/
// exports.findAnswersByViews = function (qid) {
//   return Q.Promise(function (resolve, reject) {
//     Question
//     .find({"_id": qid})
//     //FIXME use answer to pupulate
//     .populate('created_by comment.created_by answers.created_by answers.comment.created_by','name email')
//     .exec(function (err, questions) {
//       if (err) {
//         logger.error(err);
//         reject(err);
//       } else {
//         resolve(questions);
//       }
//     });
//   });
// };


/**
 * Create answer comment
 *
 * @function
 * @param {ObjectId} aid - answer id
 * @param {Comment} comment - comment to be saved
 * @return {Promise} promise to save the comment:
 * <li>comment saved: resolve with undefined
 * <li>error occur during save: reject with error
 *
 */
exports.saveComment = function (aid, comment) {
  return Q.Promise(function (resolve, reject) {
    Answer
      .update(
        { "_id": aid },
        { "$addToSet": { "comment": comment}}
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
 * Update comment
 *
 * @function
 * @param {String} aid - answer id
 * @param {String} cid - comment id
 * @param {String} content - comment content
 * @return {Promise} promise to update the comment:
 * <li>comment saved: resolve with undefined
 * <li>error occur during update: reject with error
 *
 */
exports.updateComment = function (aid, cid, content) {
  return Q.Promise(function (resolve, reject) {
    Answer
      .update(
        { '_id': aid, 'comment._id': cid },
        { '$set': { 'comment.$.content': content } }
      )
      .exec(function (err, update) {

        logger.debug(update);

        if (err) {
          reject(err);
        } else {
          resolve(update);
        }
      });
  });
};

/**
 * Delete comment
 *
 * @function
 * @param {String} aid - answer id
 * @param {String} cid - comment id
 * @return {Promise} promise to delete the comment:
 * <li>comment saved: resolve with undefined
 * <li>error occur during delete: reject with error
 *
 */
exports.deleteComment = function (aid, cid) {
  return Q.Promise(function (resolve, reject) {
    Answer.update({'_id': aid},
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

// /**
// * user fav answers
// */
// exports.favAnswer = function (uid, qid, aid, title) {
//   return Q.Promise(function (resolve, reject) {
//     var answer = {"question_id": qid,
//     "question_title": title,
//     "answer_id": aid};
//     var ids = [aid];
//     User
//     .update({"_id": uid, "fav_answers.answer_id": {"$nin": ids}},
//     {
//       "$addToSet": { "fav_answers": answer}
//     })
//     .exec(function(err, updated){
//       if(err){
//         logger.debug(err);
//         reject(err);
//       }
//       logger.debug(updated);
//       if(updated){
//         logger.debug("has inserted to user fav answers list");
//         Question.update({"_id": qid,"answers._id": aid},
//           {"$inc": {"answers.$.favs": 1}},function(err, updated){
//             if(err){
//               reject(err);
//             }else{
//               resolve({"effected": updated});
//             }
//           });
//       }else{
//         resolve({"effected": 0});
//       }
//     });
//   });
// };

// /**
// * inc view times of a answer
// */
// exports.countViewAnswer = function (qid, aid, count) {
//   return Q.Promise(function (resolve, reject) {
//     Question.update( {"_id": qid,
//       "answers._id": aid},
//       {
//         "$inc": {"answers.$.views": count},
//       },function(err, updated){
//         if(err){
//           reject(err);
//         }else{
//           resolve({"effected": updated});
//         }
//       });
//   });
// };

/**
 * @function
 * @param {String} aid - answer id
 * @param {String} uid - user id
 *
 * @return {Promise} promise to create the answer agree:
 * <li>comment saved: resolve with undefined
 * <li>error occur during create: reject with error
 */
exports.createAgree = function (aid, uid) {
  return Q.Promise(function (resolve, reject) {
    Answer.update(
      { "_id": aid },
      { "$addToSet": {"agrees": {'user': uid}} },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

/**
 * @function
 * @param {String} aid - answer id
 * @param {String} uid - user id
 *
 * @return {Promise} promise to delete the answer agree:
 * <li>comment saved: resolve with undefined
 * <li>error occur during delete: reject with error
 */
exports.deleteAgree = function (aid, uid) {
  return Q.Promise(function (resolve, reject) {
    Answer.update(
      { "_id": aid },
      { "$pull": {"agrees": {"user": uid}} },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

/**
 * @function
 * @param {String} aid - answer id
 * @param {String} content - answer content
 *
 * @return {Promise} promise to update answer content:
 * <li>comment saved: resolve with undefined
 * <li>error occur during update: reject with error
 */
exports.updateAnswer = function (aid, content) {
  return Q.Promise(function (resolve, reject) {
    Answer.update(
      { "_id": aid },
      { '$set': { 'content': content} },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

/**
 * @function
 * @param {String} aid - answer id
 *
 * @return {Promise} promise to delete the answer agree:
 * <li>comment saved: resolve with undefined
 * <li>error occur during delete: reject with error
 */
exports.deleteAnswer = function (aid) {
  return Q.Promise(function (resolve, reject) {
    Answer.remove(
      { "_id": aid },
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

// /**
// * get users that vote a answer
// */
// exports.getVoteUsers = function(qid, aid) {
//   return Q.Promise(function (resolve, reject) {
//     Question.find({"_id": qid, "answers._id": aid},
//       {"answers.$.vote_users": 1},
//       function (err, answers) {
//         if (err) {
//           logger.error(err);
//           reject(err);
//         } else {
//           resolve(answers);
//         }
//       });
//   });
// };

// /**
// * oppose a answer
// */
// exports.opposeAnswer = function(qid, aid) {
//   return Q.Promise(function (resolve, reject) {
//     Question.update( {"_id": qid,
//       "answers._id": aid},
//       {
//         "$inc": {"answers.$.opposes": 1},
//       },function(err, updated){
//         if(err){
//           reject(err);
//         }else{
//           resolve({"effected": updated});
//         }
//       });
//   });
// };

// /**
// * get user's fav answers
// */
// exports.getFavAnswers = function (uid) {
//   return Q.Promise(function (resolve, reject) {
//     User.find( {"_id": uid }, {"fav_answers": 1}
//       ,function(err, userfav){
//         if(err){
//           reject(err);
//         }else{//根据qid findquestions
//           if(userfav.length > 0) {
//               //logger.debug(userfav.length);
//               resolve(userfav[0].fav_answers);
//             }else {
//               resolve(userfav);
//             }
//           }
//         });
//   });
// };