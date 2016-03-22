
var express = require('express');
var sanitizer = require('../middlewares/sanitizer');
var auth = require('../middlewares/auth');

var index = require('../biz/index');
var signup = require('../biz/signup');
var signin = require('../biz/signin');
var project = require('../biz/project');
var recruitment = require('../biz/recruitment');
var user = require('../biz/user');
var request = require('../biz/request');
var relation = require('../biz/relation');
var question = require('../biz/question');
var answer = require('../biz/answer');
var tag = require('../biz/tag');
var message = require('../biz/message');
var settings = require('../biz/settings');
var search = require('../biz/search');
var adminRouter = require('./admin');

var router = express.Router();

router.use(['/new', '/home', '/users', '/recruitments/*', '/questions/ask', '/messages', '/chat'], auth.signinAuth);
router.use(['/admin'], auth.signinAuthforAdmin);
router.use('/', sanitizer.sanitizeFilter);

// index
router.get('/', index.index);
router.get('/home', index.userHome);
// sign up
router.get('/signup', signup.showSignupPage);
router.post('/signup', signup.signup);
router.get('/active', signup.active);
router.get('/reset', signup.reset);
router.put('/signup/reset/password', signup.changePassword);
router.get('/sms/:phone', signup.sms);
router.get('/getCaptcha', signup.captcha);
// sign in
router.get('/signin', signin.showSigninPage);
router.post('/signin', signin.signin);
router.get('/signout', signin.signout);
//footer
router.get('/construct', index.construct);
//forgot password
router.get('/forgot-password', signin.showForgotPassword);
router.post('/reset-password', signin.resetPassword);
router.post('/reset-mobile-password/:phone',signin.resetMobilePassword);
// user
router.get('/users', user.getUsers);
router.get('/users/:uid', user.getUser);
router.put('/users/:uid', user.updateUser);
router.post('/users/avatar/upload',user.updateAvatar);
// following
router.get('/home/followings', user.myFollowings);
router.post('/followings', user.addFollowing);
router.delete('/followings/:targetId', user.removeFollowing);
// friends
router.post('/requests', request.createRequest);
router.put('/requests/:rid/accept', request.acceptRequest);
router.put('/requests/:rid/deny', request.denyRequest);
router.put('/requests/:rid/ignore', request.ignoreRequest);
router.put('/relations/:rid/terminate', relation.terminateRelation);
router.get('/home/friends', user.myFriends);
router.get('/users/:uid/requestscount', request.getRequestsCount);
//Todo list
router.get('/users/:uid/todos', user.myTodos);
// message
router.get('/messages', message.messagesPage);
router.post('/messages', message.createMessage);
router.get('/users/:uid/messagescount', message.getMessagesCount);
router.get('/chat/:uid', message.chatPage);
// project
router.get('/new/project', project.newProject);
router.get('/projects', project.getProjects);
router.post('/projects', project.createProject);
router.get('/projects/:pid', project.getProject);
router.put('/projects/:pid', project.updateProject);
router.post('/projects/addLike', project.addProjectLike);
router.get('/home/projects', project.myProjects);
router.get('/home/projects/:pid', project.projectEdit);
// recruitment
router.get('/new/recruitment', recruitment.newRecruitmentPage);
router.get('/recruitments', recruitment.getRecruitments);
router.post('/recruitments', recruitment.createRecruitment);
router.get('/recruitments/:rid', recruitment.getRecruitment);
router.put('/recruitments/:rid', recruitment.updateRecruitment);
router.delete('/recruitments/:rid', recruitment.deleteRecruitment);
router.get('/home/recruitments', recruitment.myRecruitments);
router.get('/home/recruitments/:rid', recruitment.recruitmentEdit);
//questions
router.get('/questions/ask', question.askQuestion);//rendered
router.post('/questions', question.createQuestion);
router.get('/questions', question.getQuestions);//rendered, include answers, comments and comments on answer
router.get('/questions/:qid', question.getQuestion);
router.post('/questions/:qid/comments', question.createQuestionComment);

// router.get('/questionsbyview', question.findQuestionsByViews);
// router.get('/questions/:qid/answers', question.getAnswers);
// router.get('/questions/tags/:tag', question.getQuestionsByTag);//rendered
// router.put('/questions/:qid', question.updateQuestion);
//router.post('/questions/:qid/comments/:aid', question.updateQuestionComment);
//router.post('/questions/:qid/answers/:aid', question.updateAnswer);
// router.post('/questions/:qid/answers/:aid/comments', question.createAnswerComment);
//router.put('/questions/:qid/answers/:aid/comments/:uid', question.updateAnswerComment);
// router.post('/questions/:qid/fav', question.favQuestion);
// router.post('/questions/:qid/favanswer/:aid/:uid', question.favAnswer);
// router.post('/questions/:qid/view/:count', question.countViewQuestion);
// router.post('/questions/:qid/viewanswer/:aid/:count', question.countViewAnswer);
router.post('/questions/:qid/answers/:aid/best', question.markBestAnswer);
router.delete('/questions/:qid/answers/:aid/best', question.cancelBestAnswer);
// router.post('/questions/:qid/answers/:aid/vote', question.voteAnswer);
// router.post('/questions/:qid/answers/:aid/cancelvote', question.cancelVoteAnswer);
// router.post('/questions/:qid/answers/:aid/oppose', question.opposeAnswer);
// router.get('/questions/:qid/answers/:aid/getvoteusers', question.getVoteUsers);
// router.get('/questions/fav/:uid', question.getFavQuestions);
// router.get('/questions/favanswer/:uid', question.getFavAnswers);

// answer
router.post('/answers', answer.createAnswer);
router.post('/answers/:aid/comments', answer.createAnswerComment);
router.post('/answers/:aid/agrees', answer.createAnswerAgree);
router.delete('/answers/:aid/agrees', answer.deleteAnswerAgree);

// favorite
router.post('/favquestions', user.favQuestion);
router.delete('/favquestions/:qid', user.cancelFavQuestion);
router.post('/favanswers', user.favAnswer);
router.delete('/favanswers/:aid', user.cancelFavAnswer);


//address
router.get('/addr', index.getAddress);
router.post('/validateAddr', index.validateCity);
router.get('/province', index.getProvince);
router.post('/validateProvince', index.validateProvince);
//field
router.get('/field', index.getSuggestFiled);
//tag
router.get('/tags', tag.getTags);
router.get('/tags/:tid', tag.getTag);
router.post('/tags', tag.createTag);


//settings
router.get('/home/settings/password', settings.changePasswordPage);
router.put('/home/settings/password', settings.changePassword);
router.get('/home/settings/email', settings.changeEmailPage);
router.put('/home/settings/email', settings.changeEmail);
router.get('/home/settings/mobile', settings.changeMobilePage);
router.put('/home/settings/mobile', settings.changeMobile);

// search
router.get('/search', search.search);
// admin routers
router.use('/admin', adminRouter);


router.get('*', function (req, res, next) {
    res.redirect('/')
});

router.post('*', function (req, res, next) {
    res.render('error');
});

router.put('*', function (req, res, next) {
    res.render('error');
});

router.delete('*', function (req, res, next) {
    res.render('error');
});


module.exports = router;