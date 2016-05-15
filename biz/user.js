/**
 * Handle user related requests
 *
 * @module biz/user
 *
 */
var Q = require('q');
var filters = require('../config.js').filters.users;
var userProxy = require('../persistent/proxy/user');
var requestProxy = require('../persistent/proxy/request');
var relationProxy = require('../persistent/proxy/relation');
var projectProxy = require('../persistent/proxy/project.js');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var filterUtil = require('../utils/filter');
var logger = require('../utils/log').getLogger('biz/user.js');
var friendUtil = require('../utils/friendutil');
var User = require('../persistent/model/user');
var gm = require('gm');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var config = require('../config');
/**
 * 获取用户数据
 */
function getUsersService (req,res,fn){
    var method = '[getUsersService]';
    logger.info(method, 'request received to users list page');

    var filter;

    if (req.query.fellow) {
        // fellow query
        if (req.query.fellow === 'true') {
            filter = {
                '_id': {
                    $ne: reqUtil.getUserId(req)
                },
                'hometown': reqUtil.getUserHometown(req)
            };
        } else {
            filter = {
                '_id': {
                    $ne: reqUtil.getUserId(req)
                },
                'hometown': {
                    $ne: reqUtil.getUserHometown(req)
                }
            };
        }
    } else if (req.query.schoolmate) {
        // schoolmate query
        if (req.query.schoolmate === 'true') {
            filter = {
                '_id': {
                    $ne: reqUtil.getUserId(req)
                },
                'educations.school': {
                    $in: reqUtil.getUserSchools(req)
                }
            };
        } else {
            filter = {
                "_id": {
                    $ne: reqUtil.getUserId(req)
                },
                'educations.school': {
                    $nin: reqUtil.getUserSchools(req)
                }
            };
        }
    } else if (req.query.exworkmate) {
        // exworkmate query
        if (req.query.exworkmate === 'true') {
            filter = {
                '_id': {
                    $ne: reqUtil.getUserId(req)
                },
                'work_experiences.corporation': {
                    $in: reqUtil.getUserCorporations(req)
                }
            };
        } else {
            filter = {
                "_id": {
                    $ne: reqUtil.getUserId(req)
                },
                'work_experiences.corporation': {
                    $nin: reqUtil.getUserCorporations(req)
                }
            };
        }
    } else {
        // general query
        filter = filterUtil.toMongoFilter(req.query);
    }
    logger.info(method, 'filter: ' + JSON.stringify(filter));
    if(!filter.limit)
      filter['limit']=config.limit;

      Q.all([
        userProxy.findTopUsers(),
        userProxy.findUsersLimit(filter)
      ]).then(function (result) {
        logger.info(result);
        logger.info(method, result[1].length + ' users found, will render and response user list page');

        fn.success(req, res,result,filters);
      }).fail(function (err) {
        logger.error(err);
        fn.fail(req, res,err);
      });

    // userProxy.findUsersLimit(filter).then(function (users) {

    //     logger.info(method, users.length + ' users found, will render and response user list page');

    //     fn.success(req, res,users,filters);
    // }).fail(function (err) {
    //     logger.error(method, 'failed to find users due to bellow error, will response error page with the error');
    //     logger.error(err);
    //     fn.fail(req, res,err);

    // });
}
/**
 * Request handler for user list page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getUsers = function (req, res) {
    getUsersService(req,res,{
        success:function(req, res,users,filters){
            logger.info("the filters is "+JSON.stringify(filters));
            resUtil.render(req, res, 'users', {
                'tops':users[0],
                'users': users[1],
                'filters': filters
            })
        },
        fail:function(req, res, err){
            resUtil.render(req, res, 'error', err);
        }
    })
};
/***
 * 异步获取用户数据
 * @param req
 * @param res
 */
exports.getUsersAjax = function (req, res) {
    getUsersService(req,res,{
        success:function(req, res,users,filters){
            res.json({
                'tops':users[0],
                'users': users[1],
                'filters': filters
            })
        },
        fail:function(req, res,err){
            res.send(err);
        }
    },true);
};
// exports.getUsers = function (req, res) {
//    var method = '[getUsers]';
//    logger.info(this.name, 'test test ')
//    logger.info(method, 'request received to users list page');
//
//    var filter;
//
//    if (req.query.fellow) {
//        // fellow query
//        if (req.query.fellow === 'true') {
//            filter = {
//                '_id': {
//                    $ne: reqUtil.getUserId(req)
//                },
//                'hometown': reqUtil.getUserHometown(req)
//            };
//        } else {
//            filter = {
//                '_id': {
//                    $ne: reqUtil.getUserId(req)
//                },
//                'hometown': {
//                    $ne: reqUtil.getUserHometown(req)
//                }
//            };
//        }
//    } else if (req.query.schoolmate) {
//        // schoolmate query
//        if (req.query.schoolmate === 'true') {
//            filter = {
//                '_id': {
//                    $ne: reqUtil.getUserId(req)
//                },
//                'educations.school': {
//                    $in: reqUtil.getUserSchools(req)
//                }
//            };
//        } else {
//            filter = {
//                "_id": {
//                    $ne: reqUtil.getUserId(req)
//                },
//                'educations.school': {
//                    $nin: reqUtil.getUserSchools(req)
//                }
//            };
//        }
//    } else if (req.query.exworkmate) {
//        // exworkmate query
//        if (req.query.exworkmate === 'true') {
//            filter = {
//                '_id': {
//                    $ne: reqUtil.getUserId(req)
//                },
//                'work_experiences.corporation': {
//                    $in: reqUtil.getUserCorporations(req)
//                }
//            };
//        } else {
//            filter = {
//                "_id": {
//                    $ne: reqUtil.getUserId(req)
//                },
//                'work_experiences.corporation': {
//                    $nin: reqUtil.getUserCorporations(req)
//                }
//            };
//        }
//    } else {
//        // general query
//        filter = filterUtil.toMongoFilter(req.query);
//    }
//    //console.log('req.query.limit:' + req.query.limit);
//    //filter['limit'] = 10;
//    //filter['skip'] = 0;
//    logger.info(method, 'filter: ' + JSON.stringify(filter));
//
//    userProxy.findUsersLimit(filter).then(function (users) {
//        logger.info(method, users.length + ' users found, will render and response user list page');
//        resUtil.render(req, res, 'users', {
//            'users': users,
//            'filters': filters
//        });
//    }).fail(function (err) {
//        logger.error(method, 'failed to find users due to bellow error, will response error page with the error');
//        logger.error(err);
//        resUtil.render(req, res, 'error', err);
//    });
//};

/**
 * Request handler to get a user
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.getUser = function (req, res) {
    var method = '[getUser]';

    logger.info(method, 'request to user detail page');
    var uid = req.params.uid;
    logger.info(method, 'find user by id, uid: ' + uid);
    userProxy.findUserById(uid).then(function (user) {
        if (user) {
            logger.info(method, 'user found, uid: ' + user.id);
            return Q(user);
        } else {
            logger.info(method, 'user not found');
            return Q.reject({
                title: '您查找的用户不存在'
            });
        }
    }).then(function (user) {
        logger.info(method, 'find user projects');
        var promiseToFindProjects = projectProxy.findProjects({
            'creator.user': uid
        });
        var signInUserId = reqUtil.getUserId(req);
        return [
            user,
            promiseToFindProjects,
            userProxy.isFollowing(signInUserId, uid),
            requestProxy.findByReqestorAndTarget(signInUserId, uid),
            relationProxy.findByUsersId(signInUserId, uid)
        ];
    }).spread(function (user, projects, isFollowing, requests, relation) {
        logger.info(method, projects.length + ' projects founds');

        logger.info(method, 'is sigin user following the target user: ' + isFollowing);

        var isFriend = false;
        if (relation) {
            isFriend = true;
        }
        logger.info(method, 'are signin user and target user friend: ' + isFriend);

        var isRequested = false;
        var request;
        if (requests.length > 0) {
            isRequested = true;
            // return the latest request
            request = requests[0];
        }
        logger.info(method, 'is signin user request target user as friend: ' + isRequested);

        logger.info(method, 'will render user page');
        var displayName = '';
        if (user.name)
            displayName = user.name;
        else if (user.email) {
            displayName = user.email;
        } else if (user.mobile_phone) {
            displayName = user.mobile_phone.toString().substring(0, 3) + "****" + user.mobile_phone.toString().substring(8, 11);
        }
        logger.debug(displayName);
        resUtil.render(req, res, 'user', {
            'user': user,
            'displayName': displayName,
            'projects': projects,
            'isFollowed': isFollowing,
            'request': request,
            'relation': relation
        });
    }).fail(function (err) {
        logger.error(method, 'failed to find user by id due to bellow error');
        logger.error(err);
        logger.info(method, 'will render error page');
        resUtil.render(req, res, 'error', {
            error: err
        });
    });
};

/**
 * Request handler to update a user
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.updateUser = function (req, res) {
    logger.debug('request received to update a user');
    var uid = req.params.uid;
    var userUpdate = req.body;
    logger.debug('bellow is the user update');
    logger.debug(userUpdate);

    logger.debug('try find user in db and then update');
    userProxy.findUserById(uid).then(function (user) {
        logger.debug('bellow user found will update the user object');
        logger.debug(user);
        var key;
        for (key in userUpdate) {
            user[key] = userUpdate[key];
        }
        logger.debug('user updated, bellow is the updated user');
        logger.debug(user);
        logger.debug('try to persistent the updated user');
        return userProxy.saveUser(user);
    }).then(function (u) {
        logger.debug('user persistented, will store the persistented user to session and response with 200');
        req.session.user = u.toObject();
        res.status(200).end();
    }).fail(function (err) {
        logger.error('failed to persistent the updated user due to bellow error, will render error page with the bellow error');
        logger.error(err);
        resUtil.render(req, res, 'error', err);
    });
};

/**
 * Request handler to update a user's avatar
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.updateAvatar = function (req, res) {
  logger.debug('request received to update a users avatar');
  var form = new formidable.IncomingForm();
  var IMG_PATH = path.resolve(__dirname,'../public/images/upload_avatars');
  form.parse(req, function(err, fields, files) {
    var W = fields.W;
    var width = fields.w;
    var height = fields.h;
    var x = fields.x;
    var y = fields.y;
    var uid = fields.uid;
    var imgPath = files.file.path;
    var sz = files.file.size;
    logger.debug(fields);
    if(sz > 2*1024*1024){
        logger.debug('image is out of size')
        fs.unlink(imgPath, function() { //fs.unlink 删除用户上传的文件
          res.json({errCode:1001,msg:'图片超出指定大小'});
        });
    } else if (files.file.type.split('/')[0] != 'image') {
      logger.debug('file is not image')
      fs.unlink(imgPath, function() {
        res.json({errCode:1002,msg:'请上传图片文件'});
      });
    } else {
      var filetype = files.file.type.split('/')[1];
      var ts = Date.now();
      var src_path = '/images/upload_avatars/'+uid+"_"+ts+"."+filetype;
      gm(imgPath)
          .autoOrient()
          //.resize(W>850?850:W)
          .crop(width, height, x, y)
          .write(path.resolve(IMG_PATH,uid+"_"+ts+"."+filetype), function(err){
            if (err) {
              console.log(err);
              res.status(500).json({errCode:1003,msg:'处理图片时发生错误'});
            }
            userProxy.findUserById(uid).then(function (user) {
              logger.debug('bellow user found will update the user object');
              logger.debug(user);
              if(user['logo_img']&&user['logo_img'].indexOf('upload')!==-1){
                fs.unlink(path.resolve(__dirname,'../public'+user['logo_img']),function(err){
                  logger.error(err)
                });
              }
              user['logo_img'] = src_path;
              logger.debug('user updated, bellow is the updated user');
              logger.debug(user);
              logger.debug('try to persistent the updated user');
              return userProxy.saveUser(user);
            }).then(function (u) {
              logger.debug('user persistented, will store the persistented user to session and response with 200');
              fs.unlink(imgPath, function() {
              });
              req.session.user = u.toObject();
              res.status(200).json({errCode:0,msg:'上传成功',url:src_path}).end();
            }).fail(function (err) {
              logger.error('failed to persistent the updated user due to bellow error, will render error page with the bellow error');
              logger.error(err);
              res.status(200).json({errCode:1003,msg:'保存失败'});

            });
          });
    }
  });
};

exports.myInfo = function (req, res) {
var method = '[myInfo]';
logger.info(method, 'request to signin user\' info');
  resUtil.render(req, res, 'user_home_info', {
  title: '我的IT合伙人',
    });
  
};

exports.setInfo = function (req, res) {
var method = '[setInfo]';
logger.info(method, 'request to signin user\' info');
  resUtil.render(req, res, 'user_info_1', {
  title: '我的IT合伙人',
    });
  
};
exports.myProfile = function (req, res) {
var method = '[myProfile]';
logger.info(method, 'request to signin user\' info');
  resUtil.render(req, res, 'user_home_myprofile', {
  title: '我的IT合伙人',
    });
  
};
/**
 * Request handler to get a user
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.myFollowings = function (req, res) {
    var method = '[myFollowings]';
    logger.info(method, 'request to signin user\' followings');
    var uid = reqUtil.getUserId(req);
    userProxy.findUserById(uid).then(function (user) {
        logger.info(method, user.followings.length + ' signin user\' followings found');
        logger.info(method, 'will render user_home_followings page');
        resUtil.render(req, res, 'user_home_followings', {
            'followings': user.followings
        });
    }).fail(function (err) {
        logger.error(method, 'failed to find signin user\'s followings');
        logger.error(err);
        logger.info(method, 'will render error page');
        resUtil.render(req, res, 'error', {
            error: err
        });
    });
};

/**
 * Request handler to add a following
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.addFollowing = function (req, res) {
    var method = '[addFollowing]';
    logger.info(method, 'request received to add a following user');

    var followerId = reqUtil.getUserId(req);
    var targetId = req.body.targetId;
    logger.info(method, 'follower id: ' + followerId);
    logger.info(method, 'target user id: ' + targetId);

    logger.info(method, 'try to add following user');
    userProxy
        .addFollowing(followerId, targetId)
        .then(function () {
            logger.info(method, 'following added');
            logger.info(method, 'will response with success message');
            res.json('success');
        })
        .fail(function (err) {
            logger.error(method, 'failed add following');
            logger.error(method, err);
            res.status(500).json(err);
        });
};

/**
 * Request handler to remove a following
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.removeFollowing = function (req, res) {
    var method = '[removeFollowing]';
    logger.info(method, 'request received to remove a following user');

    var followerId = reqUtil.getUserId(req);
    var targetId = req.params.targetId;
    logger.info(method, 'follower id: ' + followerId);
    logger.info(method, 'target user id: ' + targetId);

    logger.info(method, 'try to remove following user');
    userProxy
        .removeFollowing(followerId, targetId)
        .then(function () {
            logger.info(method, 'following removed');
            logger.info(method, 'will response with success message');
            res.json('success');
        }).fail(function (err) {
            logger.error(method, 'failed remove following');
            logger.error(method, err);
            res.status(500).json(err);
        });
};

/**
 * Request handler to user friends
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.myFriends = function (req, res) {
    var method = '[myFriends]';
    logger.info(method, 'request received to list user friends');
    var uid = reqUtil.getUserId(req);

    var promises = [
        requestProxy.find({'requestor': uid, 'status': 'pending'}),
        requestProxy.find({'target': uid, 'status': 'pending'}),
        relationProxy.find({'users': uid})
    ];

    logger.info(method, 'try to find friends and friends request');
    Q.all(promises).spread(function (myRequests, receivedRequests, relations) {
        logger.info(method, 'requests and relations found');
        var friends = [];
        var i, friend;
        for (i = 0; i < relations.length; i++) {
            if (relations[i].users[0].id === uid) {
                friend = relations[i].users[1];
                friend.relationId = relations[i].id;
            } else {
                friend = relations[i].users[0];
                friend.relationId = relations[i].id;
            }
            friends.push(friend);
        }
        var needAction = [];
        for (i = 0; i < receivedRequests.length; i++) {
            var flag = false;
            for (j = 0; j < friends.length; j++) {
                if (receivedRequests[i].requestor.id == friends[j].id) {
                    flag = true;
                    logger.info("equal");
                }
            }
            if (!flag)
                needAction.push(receivedRequests[i]);
        }
        logger.info('render user_home_friends page');
        resUtil.render(req, res, 'user_home_friends', {
            'title': '我的好友',
            'myRequests': myRequests,
            'receivedRequests': receivedRequests,
            'needActionRequests': needAction,
            'friends': friends
        });
    });
};

/**
 * Request handler to user Todos
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.myTodos = function (req, res) {
    var method = '[myTodos]';
    logger.info(method, 'request received to list user todos');
    var uid = reqUtil.getUserId(req);

    var promises = [
        requestProxy.find({'target': uid, 'status': 'pending'}),
        relationProxy.find({'users': uid})
    ];

    logger.info(method, 'try to find friends and friends request need to handle');
    Q.all(promises).spread(function (receivedRequests, relations) {
        logger.info(method, 'requests and relations found');
        var friends = [];
        var i, friend;
        for (i = 0; i < relations.length; i++) {
            if (relations[i].users[0].id === uid) {
                friend = relations[i].users[1];
                friend.relationId = relations[i].id;
            } else {
                friend = relations[i].users[0];
                friend.relationId = relations[i].id;
            }
            friends.push(friend);
        }
        var needAction = [];
        for (i = 0; i < receivedRequests.length; i++) {
            var flag = false;
            for (j = 0; j < friends.length; j++) {
                if (receivedRequests[i].requestor.id == friends[j].id) {
                    flag = true;
                    logger.info("equal");
                }
            }
            if (!flag)
                needAction.push(receivedRequests[i]);
        }
        logger.info('get todos');
        res.status(200).json({
            'needAction': needAction.length
        });
    });
};

/**
 * Request handler to add a favorite question
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.favQuestion = function (req, res) {
    var method = '[favQuestion]';
    logger.info(method, 'request received to add a favorite question');

    var uid = reqUtil.getUserId(req);
    var qid = req.body.qid;
    logger.info(method, 'uid: ' + uid);
    logger.info(method, 'qid: ' + qid);

    userProxy
        .favQuestion(uid, qid)
        .then(function () {
            logger.info(method, 'favorite question added');
            res.json('success');
        })
        .fail(function (err) {
            logger.error(method, 'failed to add favorite question');
            logger.error(err);
            res.status(500).json(new Error('failed to add favorite question'));
        });
};

/**
 * Request handler to add a favorite question
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.cancelFavQuestion = function (req, res) {
    var method = '[cancelFavQuestion]';
    logger.info(method, 'request received to cancel a favorite question');

    var uid = reqUtil.getUserId(req);
    var qid = req.params.qid;
    logger.info(method, 'uid: ' + uid);
    logger.info(method, 'qid: ' + qid);

    userProxy
        .cancelFavQuestion(uid, qid)
        .then(function () {
            logger.info(method, 'favorite question cancelled');
            res.json('success');
        })
        .fail(function (err) {
            logger.error(method, 'failed to cancel favorite question');
            logger.error(err);
            res.status(500).json(new Error('failed to cancel favorite question'));
        });
};

/**
 * Request handler to add a favorite answer
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.favAnswer = function (req, res) {
    var method = '[favAnswer]';
    logger.info(method, 'request received to add a favorite answer');

    var uid = reqUtil.getUserId(req);
    var aid = req.body.aid;
    logger.info(method, 'uid: ' + uid);
    logger.info(method, 'aid: ' + aid);

    userProxy
        .favAnswer(uid, aid)
        .then(function () {
            logger.info(method, 'favorite answer added');
            res.json('success');
        })
        .fail(function (err) {
            logger.error(method, 'failed to add favorite a answer');
            logger.error(err);
            res.status(500).json(new Error('failed to add favorite answer'));
        });
};

/**
 * Request handler to cancel a favorite answer
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.cancelFavAnswer = function (req, res) {
    var method = '[cancelFavAnswer]';
    logger.info(method, 'request received to add a favorite answer');

    var uid = reqUtil.getUserId(req);
    var aid = req.params.aid;
    logger.info(method, 'uid: ' + uid);
    logger.info(method, 'aid: ' + aid);

    userProxy
        .cancelFavAnswer(uid, aid)
        .then(function () {
            logger.info(method, 'favorite answer cancelled');
            res.json('success');
        })
        .fail(function (err) {
            logger.error(method, 'failed to cancel favorite answer');
            logger.error(err);
            res.status(500).json(new Error('failed to cancel favorite answer'));
        });
};