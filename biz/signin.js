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
var Q = require('q');
var signUp = require('./signup');
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
        res.cookie('ithhr_uid', crypto.encrypt(String(user.email)));
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
  var registry = req.body.registry;
  var captcha = req.body.captcha;
  if(registry === 'phone'){
    var phone = req.body.phone;
    if (phone === '' || captcha === '') {
       resUtil.render(req, res, 'forgot_password', {error: '信息不完整。', phone: phone});
       return;
     }
     logger.debug('check if phone is valid, phone: ' +  phone);
     if (!validator.isMobilePhone(phone,'zh-CN')) {
       resUtil.render(req, res, 'forgot_password', {error: '不正确的手机号。', phone: phone});
       return;
     }
     logger.debug(req.session.capText);
     logger.debug('check if captcha is valid, captcha: ' +  captcha + ' with generated Code '+req.session.capText);
     if (req.session.capText.toLowerCase()!=captcha.toLowerCase()) {
       resUtil.render(req, res, 'forgot_password', {error: '图形验证码不正确。', captcha: captcha});
       return;
     }
     signUp.sms(req,res,function(data){
        if(data.success){
          resUtil.render(req, res, 'confirm_mobile_pass_reset',{
            phone: req.body.phone
          });
        }else{
          resUtil.render(req, res, 'confirm_mobile_pass_reset', {error: data.msg, phone: phone});
        }
     }); 
  }
  else{
    var email = req.body.email;
    var password = req.body.password;
    if(!password)
      password = "fdsafwerew";
    logger.debug('check if email address is exist, email: ' +  email);
    if (email === '') {
       resUtil.render(req, res, 'forgot_password', {error: '邮箱未填写', email: email});
       return;
     }
     logger.debug('check if captcha is exist');
    if (captcha === '') {
       resUtil.render(req, res, 'forgot_password', {error: '请输入图形验证码', email: email});
       return;
     }
     logger.debug(req.session.capText);
     logger.debug('check if captcha is valid, captcha: ' +  captcha + ' with generated Code '+req.session.capText);
     if (req.session.capText.toLowerCase()!=captcha.toLowerCase()) {
       resUtil.render(req, res, 'forgot_password', {error: '图形验证码不正确。', captcha: captcha});
       return;
     }
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
  
}

exports.resetMobilePassword = function (req, res) {
  var phone = req.params.phone
  var sms = req.body.sms;
  var password = req.body.password;
    if(!password)
      password = "fdsafwerew";

    logger.debug('check if phone and sms are all set');
     if (phone === '' || sms==='') {
       resUtil.render(req, res, 'confirm_mobile_pass_reset', {error: '信息不完整。', phone: phone});
       return;
     }
     logger.debug('check if sms is valid, smsText: ' +  sms);
     logger.debug(global.smsMap);
     if (global.smsMap[phone]!=sms) {
       resUtil.render(req, res, 'confirm_mobile_pass_reset', {error: '手机验证码不正确。', sms: sms});
       return;
     }

     logger.debug('check if password length >= 8');
     if (password.length < 8) {
       resUtil.render(req, res, 'confirm_mobile_pass_reset', {error: '密码长度必须大于或等于8位', phone: phone});
       return;
     }

    logger.debug('check if phone is exist, phone: ' +  phone);
    //TODO
    userProxy.findUserByPhone(phone).then(function (user) {
      if (!user) {
        resUtil.render(req, res, 'confirm_mobile_pass_reset', {error: '不能重置密码，因为用户账号不存在，请先注册', action:'/signup',phone: phone});

      } else {
        logger.debug('all check passed');

        logger.debug('try to reset user password');
        //TODO
        //var newPwd = "p0o9i8u7";
        user.password = crypto.md5(password);
        return userProxy.saveUser(user).then(function () {
          resUtil.render(req, res, 'signup', {
            success: '密码已经重置，请返回主页登陆',
            action: '/signin'
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
      resUtil.render(req, res, 'confirm_mobile_pass_reset', {error: '出错啦，请稍后再试'});
    });
    if (!validator.isMobilePhone(phone,'zh-CN')) {
      resUtil.render(req, res, 'confirm_mobile_pass_reset', {error: '不正确的手机号码', phone: phone});
      return;
    }
    logger.info(phone);
    
  
}
