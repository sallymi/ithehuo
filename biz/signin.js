/**
 * Handle sign in requests
 *
 * @module biz/signin
 *
 */
var validator = require('validator');
var userProxy = require('../persistent/proxy/user');
var reqUtil = require('../utils/request');
var resUtil = require('../utils/response');
var crypto = require('../utils/crypto');
var logger = require('../utils/log').getLogger('biz/signin.js');
var mailer = require('../utils/mail');

exports.showSigninPage = function (req, res) {

  logger.info('check if redirect url is provided');
  var redirectUrl = req.query.redirect;

  if (redirectUrl) {
    logger.info('redirect url provided: ' + redirectUrl);
    req.session.redirectUrl = redirectUrl;
  }

  resUtil.render(req, res, 'signin');
};

exports.signin = function (req, res) {
  logger.info('request received to signin');
  var email = req.body.username;
  var password = req.body.password;

  logger.info('check if email and password are all set');
  if (!email || !password) {
    logger.info('user email or password not set, will return');
    resUtil.render(req, res, 'signin', {error: '账户和密码不能为空。'});
    return;
  }

  
  if(validator.isEmail(email)){
    logger.info('check if user exist,user email: ' + email);
    userProxy.findUserByEmail(email).then(function (user) {
      if (!user) {
        logger.info('user not exist, will return');
        resUtil.render(req, res, 'signin', {error: '请输入正确的账号。'});
        return;
      }

      logger.info('check if user password is correct');
      if (crypto.md5(password) !== user.password) {
        logger.info('user password not correct, will return');
        resUtil.render(req, res, 'signin', {error: '您输入的账户或者密码不正确，请重新输入。'});
        return;
      }

      logger.info('check if user is active');
      if (!user.active) {
        logger.info('user not active, will return');
        resUtil.render(req, res, 'signin', {error: '您的账户尚未激活，我们已经向您的注册邮箱' + user.email + '发送了激活邮件，点击邮件中的激活链接即可激活账户。'});
        return;
      }

      logger.info('login success');

      var rememberMe = req.body.remeberme;
      logger.info('check if user checked remember me, remember me: ' + rememberMe);
      if (rememberMe) {
        res.cookie('ithhr_uid', crypto.encrypt(user.email));
      }

      logger.info('store user to session');
      req.session.user = user.toObject();

      logger.info('check if original url exist in session');
      var originalUrl = reqUtil.getOriginalUrl(req);
      if (originalUrl) {
        logger.info('original url found in session, redirect user to original url');
        res.redirect(originalUrl);
        return;
      }
      logger.info('original url not found in session');

      logger.info('check if redirect url exist in session');
      var redirectUrl = reqUtil.getRedirectUrl(req);
      if (redirectUrl) {
        logger.info('redirect url found in session, redirect user to provided redirect url');
        res.redirect(redirectUrl);
        return;
      }
      logger.info('redirect url not found in session');

      logger.info('redirect user to home page');
      res.redirect('/');

    }).fail(function (err) {
      logger.error(err);
      resUtil.render(req, res, 'signin', {error: '出错了，请稍后再试。'});
    });
  }else{
    logger.info('check if user exist,user phone: ' + email);
    userProxy.findUserByPhone(email).then(function (user) {
      if (!user) {
        logger.info('user not exist, will return');
        resUtil.render(req, res, 'signin', {error: '请输入正确的账号。'});
        return;
      }

      logger.info('check if user password is correct');
      logger.info("password==="+password);
      logger.info("crypto password==="+crypto.md5(password));
      logger.info("user password==="+user.password);
      if (crypto.md5(password) !== user.password) {
        logger.info('user password not correct, will return');
        resUtil.render(req, res, 'signin', {error: '您输入的账户或者密码不正确，请重新输入。'});
        return;
      }

      logger.info('check if user is active');
      if (!user.active) {
        logger.info('user not active, will return');
        resUtil.render(req, res, 'signin', {error: '您的账户尚未激活，我们已经向您的注册邮箱' + user.email + '发送了激活邮件，点击邮件中的激活链接即可激活账户。'});
        return;
      }

      logger.info('login success');

      var rememberMe = req.body.remeberme;
      logger.info('check if user checked remember me, remember me: ' + rememberMe);
      if (rememberMe) {
        res.cookie('ithhr_uid', crypto.encrypt(user.email));
      }

      logger.info('store user to session');
      req.session.user = user.toObject();

      logger.info('check if original url exist in session');
      var originalUrl = reqUtil.getOriginalUrl(req);
      if (originalUrl) {
        logger.info('original url found in session, redirect user to original url');
        res.redirect(originalUrl);
        return;
      }
      logger.info('original url not found in session');

      logger.info('check if redirect url exist in session');
      var redirectUrl = reqUtil.getRedirectUrl(req);
      if (redirectUrl) {
        logger.info('redirect url found in session, redirect user to provided redirect url');
        res.redirect(redirectUrl);
        return;
      }
      logger.info('redirect url not found in session');

      logger.info('redirect user to home page');
      res.redirect('/');

    }).fail(function (err) {
      logger.error(err);
      resUtil.render(req, res, 'signin', {error: '出错了，请稍后再试。'});
    });
  }
  
};

exports.signout = function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      logger.error(err);
    }
    res.clearCookie('ithhr_uid');
    res.redirect('/');
  });
};

exports.showForgotPassword = function (req, res) {
  resUtil.render(req, res, 'forgot_password');
};

exports.resetPassword = function (req, res) {
  var email = req.body.username;
  var password = req.body.password;
  if(!password)
    password = "fdsafwerew";
  logger.debug('check if email address is exist, email: ' +  email);
  //TODO
  userProxy.findUserByEmail(email).then(function (user) {
    if (!user) {
      resUtil.render(req, res, 'forgot_password', {error: '不能重置密码，因为用户账号不存在或还未激活', email: email});

    } else {
      logger.debug('all check passed');

      logger.debug('try to reset user password');
      //TODO
      var newPwd = "p0o9i8u7";
      user.password = crypto.md5(newPwd);
      return userProxy.saveUser(user).then(function () {
        logger.debug('try to send a mail to change password, mail: ' + email);
        return mailer.sendResetPwdMail(email, newPwd);
      }).then(function (email) {
        resUtil.render(req, res, 'signup', {
          success: '密码重置邮件已发送至你的邮箱：' + email + ' 请尽快登录你的邮箱接收邮件,链接激活后可重置密码。'
        });
      });


      // return userProxy.changePassword(email, password).then(function (email) {
      //   logger.debug('try to send a mail to change password, mail: ' + email);
      //   //return email;
      //   return mailer.sendActiveMail(user.email);

      // }).then(function (email) {
      //   resUtil.render(req, res, 'signup', {
      //     success: '您的密码已经重置！我们已给您的注册邮箱 ' + email + ' 发送了一封邮件，登陆后尽快修改密码。'
      //   });
      // });
    }
  }).fail(function (err) {
    logger.error(err);
    resUtil.render(req, res, 'forgot_password', {error: '出错啦，请稍后再试'});
  });
  if (!validator.isEmail(email)) {
    resUtil.render(req, res, 'forgot_password', {error: '不正确的电子邮箱。', email: email});
    return;
  }
  logger.info(email);
}