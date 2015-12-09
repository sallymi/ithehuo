/**
 * Handle questions related requests
 *
 * @module biz/questions
 *
 */
var Q = require('q');
var questionProxy = require('../persistent/proxy/question');
var answerProxy = require('../persistent/proxy/answer');
var userProxy = require('../persistent/proxy/user');
var tagProxy = require('../persistent/proxy/tag');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var logger = require('../utils/log').getLogger('biz/question.js');

/**
 * Request handler to create a question
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createQuestion = function (req, res) {
  var method = '[createQuestion]';
  logger.info(method, 'request received to create a question');

  var uid = reqUtil.getUserId(req);
  var questionToSave = req.body;
  questionToSave.created_by = uid;

  logger.info(method, 'check if tag exist');
  tagProxy.findTag({
    'title': questionToSave.tag
  }).then(function (tag) {
    if (tag) {
      logger.info(method, 'tag exist');
      return Q(tag);
    } else {
      logger.info(method, 'tag not exist, will create one');
      return tagProxy.saveTag({'title': questionToSave.tag});
    }
  }).then(function (tag) {
    logger.info(method, 'tag id set, will create question');
    questionToSave.tag = tag.id;
    return questionProxy.saveQuestion(questionToSave);
  }).then(function (question) {
    logger.info(method, 'question created, will response with the question');
    res.json(question);
  }).fail(function (err) {
    logger.error(method, 'error occur when try to create question, will response with the error');
    logger.error(method, err);
    res.status(500).json(err);
  });
};

/**
 * Request handler for question list page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getQuestions = function (req, res) {
  var method = '[getQuestions]';
  logger.info(method, 'request received to questions list page');

  logger.info(method, 'try to find user and questions');
  var promises = [
    questionProxy.findQuestions()
  ];
  var uid = reqUtil.getUserId(req);
  if (uid) {
    promises.push(userProxy.findUserById(uid));
  }
  Q.all(promises).spread(function (questions, user) {
    logger.info(method, 'user and questions found');
    var i;
    var promisesToFindAnswers = [];
    for (i = 0; i < questions.length; i++) {
      promisesToFindAnswers.push(answerProxy.findAnswers({
        'question': questions[i].id
      }));
    }
    return [questions, Q.all(promisesToFindAnswers), user];
  }).spread(function (questions, answers, user) {
    logger.info(method, 'answer found, will merge answers to questions');
    var i;
    for (i = 0; i < questions.length; i++) {
      questions[i].answers = answers[i];
    }
    logger.info(method, 'merge done');

    logger.info(method, 'will render questions page');
    resUtil.render(req, res, 'questions', {
      'questions': questions,
      'fav_questions': user ? user.fav_questions : [],
      'fav_answers': user ? user.fav_answers : [],
      'searchType': 'question'
    });
  }).fail(function (err) {
    logger.error('failed to find user or questions');
    logger.error(err);
    resUtil.render(req, res, 'error', err);
  });
};

/**
 * Request handler to question detail page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getQuestion = function (req, res) {
  var method = '[getQuestion]';
  logger.info(method, 'request to question detail page');

  var aid = req.query.answerId;
  var qid = req.params.qid;
  var uid = reqUtil.getUserId(req);

  logger.info(method, 'try to find question, answer and user');
  var promises = [
    questionProxy.findQuestionById(qid),
    answerProxy.findAnswers({'question': qid})
  ];
  if (uid) {
    promises.push(userProxy.findUserById(uid));
  }
  Q.all(promises).spread(function (question, answers, user) {
    if (!question) {
      return Q.reject(new Error('question not found'));
    }
    logger.info(method, 'find complete');

    logger.info(method, 'check if question is favorited by user');
    var isFavorited = false;
    if (user && user.fav_questions) {
      var i;
      for (i = 0; i < user.fav_questions.length; i++) {
        if (user.fav_questions[i].question.id === question.id) {
          logger.info(method, 'question is favorited by user');
          isFavorited = true;
          break;
        }
      }
    }
    logger.info(method, 'question favorite check complete');

    logger.info(method, 'check if answers are favorited by user');
    if (user && user.fav_answers) {
      var j, k;
      for (j = 0; j < user.fav_answers.length; j++) {
        for (k = 0; k < answers.length; k++) {
          if (user.fav_answers[j].answer.id === answers[k].id) {
            answers[k].isFavorited = true;
            logger.info(method, 'answer is favorited, answer id: ' + answers[k].id);
          }
        }
      }
    }
    logger.info(method, 'answers favorite check complete');

    logger.info(method, 'will render page');
    resUtil.render(req, res, 'questions_item', {
      'question': question,
      'answers': answers,
      'fav_questions': user ? user.fav_questions : [],
      'fav_answers': user ? user.fav_answers : [],
      'isFavorited': isFavorited,
      'searchType': 'question'
    });

    // TODO: fiture out the difference between questions_item_fav and questions_item
    // and merge them

    // if (aid) {
    //   resUtil.render(req, res, 'questions_item_fav', question);
    // } else {
    //   resUtil.render(req, res, 'questions_item', question);
    // }

  }).fail(function (err) {
    logger.error(method, 'failed to render question detail page due to bellow error');
    logger.error(err);
    logger.info(method, 'will render error page');
    resUtil.render(req, res, 'error', err);
  });
};






// exports.getQuestionsByTag = function (req, res) {
//   logger.debug('request received to questions list page');
//   logger.debug('try to find questions by tag in db');
//   var tag = req.params.tag;
//   logger.debug(tag);
//   tagProxy.findTagById(tag).then(function(tagResult){
//     questionProxy.findQuestionByTag(tag).then(function (questions) {
//       logger.debug('bellow questions found, will render and response question list page');
//     //logger.debug(questions);
//     resUtil.render(req, res, 'questions_tags', {'questions': questions, 'tag':tagResult});
//     //res.json(questions);
//   }).fail(function (err) {
//     logger.error('failed to find all questions due to bellow error, will response error page with the error');
//     logger.error(err);
//     resUtil.render(req, res, 'error', err);
//     //res.status(500).json(err);
//   });
// }).fail(function (err) {
//   logger.error('failed to find all questions due to bellow error, will response error page with the error');
//   logger.error(err);
//   resUtil.render(req, res, 'error', err);
//     //res.status(500).json(err);
//   });
// };

// exports.getAnswers = function (req, res) {
//   logger.debug('request received to answer list page');
//   logger.debug('try to find all answers in db');
//   var qid = req.params.qid;
//   questionProxy.findAllAnswers(qid).then(function (answers) {
//     logger.debug('bellow answers found, will render and response answers list page');
//     //logger.debug(answers);
//     //resUtil.render(req, res, 'questions', {'questions': questions});
//     res.json(answers);
//   }).fail(function (err) {
//     logger.error('failed to find all answers due to bellow error, will response error page with the error');
//     logger.error(err);
//     //resUtil.render(req, res, 'error', err);
//     res.status(500).json(err);
//   });
// };

/**
 * Request handler to new question page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.askQuestion = function (req, res) {
  logger.debug('request to ask question page');
  resUtil.render(req, res, 'questions_ask', null);
};

/**
 * Request handler to update a question
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
// exports.updateQuestion = function (req, res) {
//   logger.debug('request received to update a question');
//   var qid = req.params.qid;
//   var title = req.body.title;
//   var content = req.body.content;
//   logger.debug('bellow is the question update');
//   logger.debug(title);
//   logger.debug(content);
//   logger.debug('try find question in db and then update');
//   questionProxy.updateQustion(qid, title, content).then(function (u) {
//     logger.debug('update question success');
//     res.json(u);
//   }).fail(function (err) {
//     logger.error('failed to update question');
//     logger.error(err);
//     res.json(err);
//   });
// };

/**
 * Request handler to create a question
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
// exports.createAnswer = function (req, res) {
//   logger.debug('request received to create answer for a question');
//   var qid = req.params.qid;
//   var uid = reqUtil.getUserId(req);
//   var answerToSave = req.body;
//   answerToSave.created_by = uid;
//   logger.debug('bellow is the answer create');
//   logger.debug(answerToSave);

//   logger.debug('try find question in db and then save answer');
//   questionProxy.saveAnswer(qid,answerToSave).then(function (pro) {
//     logger.info('bellow answer created, will response with the answer');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to create answer, will response with the error');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
 * Request handler to create a question comment
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.createQuestionComment = function (req, res) {
  var method = '[createQuestionComment]';
  logger.info(method, 'request received to create a question comment');

  var qid = req.params.qid;
  var uid = reqUtil.getUserId(req);
  var commentToCreate = req.body;

  commentToCreate.created_by = uid;
  logger.info(method, commentToCreate);

  logger.info(method, 'try create comment');
  questionProxy.saveComment(qid, commentToCreate).then(function () {
    logger.info(method, 'comment created, will response with the comment');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to create comment');
    logger.error(err);
    logger.info(method, 'will response with the error');
    res.status(500).json(err);
  });
};

/**
* create a comment of a answer
*/
// exports.createAnswerComment = function (req, res) {
//   var qid = req.params.qid;
//   var uid = reqUtil.getUserId(req);
//   var aid = req.params.aid;
//   var comment = req.body;
//   comment.created_by = uid;
//   logger.debug('bellow is the comment create');
//   logger.debug(comment);

//   logger.debug('try find question in db and then save comment');
//   questionProxy.saveAnswerComment(qid,aid,comment).then(function (pro) {
//     logger.info('bellow comment created, will response with the comment');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to create comment, will response with the error');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };


/**
* use fav a answer of a question
*/
// exports.favAnswer = function (req, res) {
//   var uid = req.params.uid;
//   var qid = req.params.qid;
//   var aid = req.params.aid;
//   var title = req.body;
//   if(title) title = title.content;
//   logger.debug('user add fav answer:' + title);
//   logger.debug('user id:' + uid + " question id: " + qid + " answer id: "+ aid);
//   questionProxy.favAnswer(uid, qid, aid, title).then(function (pro) {
//     logger.info('bellow fav answer finished');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to fav answer');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
 * Request handler to mark a best answer
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.markBestAnswer = function (req, res) {
  var method = '[markBestAnswer]';
  logger.info(method, 'request received to mark best answer');

  var qid = req.params.qid;
  var aid = req.params.aid;

  logger.info(method, 'begin mark best answer of a question');
  questionProxy.markBestAnswer(qid, aid).then(function () {
    logger.info(method, 'mark successs');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'failed to mark best answer');
    logger.error(method, err);
    res.status(500).json(err);
  });
};

/**
 * Request handler to cancel best answer
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.cancelBestAnswer = function (req, res) {
  var method = '[cancelBestAnswer]';
  logger.info(method, 'request received to cancel best answer');

  var qid = req.params.qid;
  var aid = req.params.aid;

  logger.info(method, 'begin cancel best answer');
  questionProxy.cancelBestAnswer(qid, aid).then(function () {
    logger.info(method, 'cancel successs');
    res.json('success');
  }).fail(function (err) {
    logger.error(method, 'error occur when try to cancel the mark best answer');
    logger.error(method, err);
    res.status(500).json(err);
  });
};

/**
* inc view times of a question
*/
// exports.countViewQuestion = function (req, res) {
//   var qid = req.params.qid;
//   var count = req.params.count;
//   logger.debug('begin inc question view times');
//   questionProxy.countViewQuestion(qid, count).then(function (pro) {
//     logger.info('inc successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to mark inc question view times');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
* inc view times of answer of a question
*/
// exports.countViewAnswer = function (req, res) {
//   var aid = req.params.aid;
//   var count = req.params.count;
//   logger.debug('begin inc answer view times');
//   questionProxy.countViewAnswer(aid, count).then(function (pro) {
//     logger.info('inc successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to mark inc answer view times');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
* vote answer of a question
*/
// exports.voteAnswer = function (req, res) {
//   var qid = req.params.qid;
//   var aid = req.params.aid;
//   var uid = reqUtil.getUserId(req);
//   logger.debug('begin vote answer');
//   questionProxy.voteAnswer(qid, aid, uid).then(function (pro) {
//     logger.info('vote successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to vote answer');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
* vote answer of a question
*/
// exports.cancelVoteAnswer = function (req, res) {
//   var qid = req.params.qid;
//   var aid = req.params.aid;
//   var uid = reqUtil.getUserId(req);
//   logger.debug('begin vote answer');
//   questionProxy.cancelVoteAnswer(qid, aid, uid).then(function (pro) {
//     logger.info('vote successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to vote answer');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

// exports.getVoteUsers = function(req, res) {
//   var qid = req.params.qid;
//   var aid = req.params.aid;
//   logger.debug('get users that vote a answer');
//   questionProxy.getVoteUsers(qid, aid).then(function (pro) {
//     logger.info('get successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to get users that vote a answer');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// }

/**
* oppose answer of a question
*/
// exports.opposeAnswer = function (req, res) {
//   var qid = req.params.qid;
//   var aid = req.params.aid;
//   logger.debug('begin vote answer');
//   questionProxy.opposeAnswer(qid, aid).then(function (pro) {
//     logger.info('vote successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to oppose answer');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
* find questions by some sort field
*/
// exports.findQuestionsByViews = function (req, res) {
//   logger.debug('begin find questions by views');
//   questionProxy.findQuestionsByViews().then(function (pro) {
//     logger.info('find successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to find and sort qustions');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
* get user's fav questions
*/
// exports.getFavQuestions = function (req, res) {
//   logger.debug('begin get fav questions of user');
//   var uid = req.params.uid;
//   questionProxy.getFavQuestions(uid).then(function (pro) {
//     logger.info('find successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to find fav qustions');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };

/**
* get user's fav answers
*/
// exports.getFavAnswers = function (req, res) {
//   logger.debug('begin get fav answers of user');
//   var uid = req.params.uid;
//   questionProxy.getFavAnswers(uid).then(function (pro) {
//     logger.info('find successs');
//     logger.info(pro);
//     res.json(pro);
//   }).fail(function (err) {
//     logger.error('error occur when try to find fav answers');
//     logger.error(err);
//     res.status(500).json(err);
//   });
// };