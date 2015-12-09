/**
 * Handle sign up requests
 *
 * @module biz/signup
 *
 */
var validator = require('validator');
var userProxy = require('../persistent/proxy/user');
var config = require('../config');
var resUtil = require('../utils/response');
var crypto = require('../utils/crypto');
var mailer = require('../utils/mail');
var logger = require('../utils/log').getLogger('biz/sign');

exports.showSignupPage = function (req, res) {
  resUtil.render(req, res, 'signup');
};

exports.signup = function (req, res) {
  logger.debug('request received to sign up');
  var email = req.body.email;
  var pass = req.body.password;
  var re_pass = req.body.re_password;

  logger.debug('check if email, password and re_password are all set');
  if (email === '' || pass === '' || re_pass === '') {
    resUtil.render(req, res, 'signup', {error: '信息不完整。', email: email});
    return;
  }

  logger.debug('check if email is valid, email: ' +  email);
  if (!validator.isEmail(email)) {
    resUtil.render(req, res, 'signup', {error: '不正确的电子邮箱。', email: email});
    return;
  }

  logger.debug('check if password === re_password');
  if (pass !== re_pass) {
    resUtil.render(req, res, 'signup', {error: '两次密码输入不一致。', email: email});
    return;
  }

  logger.debug('check if password length >= 8');
  if (pass.length < 8) {
    resUtil.render(req, res, 'signup', {error: '密码长度必须大于或等于8位', email: email});
    return;
  }

  logger.debug('check if email is already taken');
  userProxy.findUserByEmail(email).then(function (user) {
    if (user) {
      resUtil.render(req, res, 'signup', {error: '邮箱已被使用。', email: user.email});

    } else {
      logger.debug('all check passed');

      var password = crypto.md5(pass);

      logger.debug('try to create user');
      return userProxy.createUser({
        'email': email,
        'password': password
      }).then(function (user) {
        logger.debug('try to send an active mail, mail: ' + user.email);
        return mailer.sendActiveMail(user.email);

      }).then(function (email) {
        resUtil.render(req, res, 'signup', {
          success: '欢迎加入IT合伙人！我们已给您的注册邮箱 ' + email + ' 发送了一封邮件，请点击里面的链接来激活您的帐号。'
        });
      });
    }
  }).fail(function (err) {
    logger.error(err);
    resUtil.render(req, res, 'signup', {error: '出错啦，请稍后再试'});
  });
};

exports.active = function (req, res) {
  logger.debug('request received to active account');
  var base64Email = req.query.email;
  var ticket = req.query.ticket;

  logger.debug('validate if the active url is valid');
  if (!base64Email || !ticket) {
    resUtil.render(req, res, 'user_active', {error: '错误的激活链接'});
    return;
  }

  var email = crypto.base64Decode(base64Email);
  var hash = crypto.md5(email + config.secret);
  logger.debug('email: ' + email);

  if (ticket === hash) {
    userProxy.findUserByEmail(email).then(function (user) {
      user.active = true;
      return userProxy.saveUser(user);
    }).then(function (user) {
      logger.debug('user account actived, user email: ' + user.email);
      resUtil.render(req, res, 'user_active');
    }).fail(function (err) {
      logger.error(err);
      resUtil.render(req, res, 'user_active', {error: '激活失败'});
    });
  }
};