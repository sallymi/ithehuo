/**
 * provide the route for admin requests
 *
 * @module routers/admin
 *
 */
var express = require('express');
var auth = require('../middlewares/auth');
var index = require('../biz/admin/index.js');
var project = require('../biz/admin/project.js');
var question = require('../biz/admin/question.js');
var answer = require('../biz/admin/answer.js');

var router = express.Router();

// router.use(auth.basic);

router.get('/', index.indexPage);
router.get('/projects', project.projectPage);
router.post('/projects/hot', project.addHot);
router.delete('/projects/hot', project.removeHot);
router.post('/projects/recommended', project.addRecommended);
router.delete('/projects/recommended', project.removeRecommended);
router.get('/questions', question.questionsPage);
router.get('/questions/:qid', question.questionPage);
router.put('/questions/:qid', question.updateQuestion);
router.delete('/questions/:qid', question.deleteQuestion);
router.put('/questions/:qid/comments/:cid', question.updateComment);
router.delete('/questions/:qid/comments/:cid', question.deleteComment);
router.get('/answers/:aid', answer.answerPage);
router.put('/answers/:aid', answer.updateAnswer);
router.delete('/answers/:aid', answer.deleteAnswer);
router.put('/answers/:aid/comments/:cid', answer.updateComment);
router.delete('/answers/:aid/comments/:cid', answer.deleteComment);

// TODO: just for development, need remove before go to production
router.get('/reset', index.reset);
router.get('/init', index.init);

module.exports = router;