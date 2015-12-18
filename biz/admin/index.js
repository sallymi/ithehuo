/**
 * Handle admin index requests
 *
 * @module biz/admin/index
 *
 */
var Q = require('q');
var Project = require('../../persistent/model/project.js');
var Question = require('../../persistent/model/question.js');
var Answer = require('../../persistent/model/answer.js');
var Recruitment = require('../../persistent/model/recruitment.js');
var Tag = require('../../persistent/model/tag.js');
var User = require('../../persistent/model/user.js');
var Request = require('../../persistent/model/request.js');
var Relation = require('../../persistent/model/relation.js');
var Message = require('../../persistent/model/message.js');
var userProxy = require('../../persistent/proxy/user');
var tagProxy = require('../../persistent/proxy/tag');
var logger = require('../../utils/log').getLogger('biz/admin/index.js');


exports.indexPage = function (req, res) {
  // res.render('admin_signin',{
  //   'header': '登陆控制台'
  // });
  res.render('admin/index', {
    'header': '控制台'
  });
};

exports.init = function (req, res) {
  var method = '[init]';
  logger.info(method, 'user init begin');
  var initUser = require('../../init_data/user.js');
  userProxy.findUserByEmail(initUser.email).then(function (user) {
    if (user) {
      logger.info(method, 'user already exist');
      return Q(user);
    } else {
      logger.info(method, 'user not exist, will create user');
      return userProxy.createUser(initUser);
    }
  }).then(function (user) {
    logger.info(method, 'user init done');
    logger.info(method, 'tag init begin');
    var tagsToCreate = [];
    var tags = require('../../init_data/tags.js');
    var i, tag;
    for(i = 0; i < tags.length; i++) {
      tag = tags[i];
      tagsToCreate.push({
        'title': tag
      });
    }
    return [user, Q(Tag.create(tagsToCreate))];
  }).spread(function (user, results) {
    logger.info(method, 'tag init done');
    logger.info(method, 'init done');
    var response = {
      user: user,
      tags: results
    }
    res.json(response);
  }).fail(function (err) {
    logger.error(method, 'init failed');
    logger.error(err);
    res.json(err);
  });
};

exports.reset = function (req, res) {
  Project.remove(function () {
    Recruitment.remove(function () {
      Question.remove(function () {
        Answer.remove(function () {
          Tag.remove(function () {
            User.remove(function () {
              Request.remove(function () {
                Relation.remove(function () {
                  Message.remove(function () {
                    res.json('done');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};