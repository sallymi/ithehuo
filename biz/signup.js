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
var App = require('alidayu-node');
var ccap = require('ccap-dev')({
  width: 120,
  height: 43,
  offset: 24,
  quality: 100,
  fontSize: 24,
  textLen: 4,
  noiseType: 2,
  noiseSigma: 1
});

exports.showSignupPage = function (req, res) {
  resUtil.render(req, res, 'signup');

};
exports.sms = function (req, res) {
  var phone = req.params.phone;
  logger.debug('get the phone number');
  var app = new App('23298060', '64a0fe73e56868f9ef9cabd3461ed48f');
  app.smsSend({
      sms_free_sign_name: '注册验证', //短信签名，参考这里 http://www.alidayu.com/admin/service/sign
      sms_param: JSON.stringify({"code": "123456", "product": "［IT合伙人］"}),//短信变量，对应短信模板里面的变量
      rec_num: phone, //接收短信的手机号
      sms_template_code: 'SMS_4425967' //短信模板，参考这里 http://www.alidayu.com/admin/service/tpl
  }, function(result){
    logger.debug(result);
    resUtil.okJson(res, '已发送');
  });
  
};
exports.captcha = function (req, res) {
    var ary = ccap.get();
    var txt = ary[0];
    var buf = ary[1];
    logger.debug(txt);
    res.set('Content-Type', 'image/jpeg');
    res.send(buf);
};
exports.signup = function (req, res) {
  logger.debug('request received to sign up');
  var email = req.body.email;
  var pass = req.body.password;
  var re_pass = req.body.re_password;
  // var phone = req.body.phone;
  // var captcha = req.body.captcha;
  // var sms = req.body.sms;

  // if(email){
  //   logger.debug('check if email, password and re_password are all set');
  //   if (email === '' || pass === '' || re_pass === '') {
  //     resUtil.render(req, res, 'signup', {error: '信息不完整。', email: email});
  //     return;
  //   }

  //   logger.debug('check if email is valid, email: ' +  email);
  //   if (!validator.isEmail(email)) {
  //     resUtil.render(req, res, 'signup', {error: '不正确的电子邮箱。', email: email});
  //     return;
  //   }
  // }else{
  //   logger.debug('check if phone, captcha and sms are all set');
  //   if (phone === '' || captcha === '' || sms === '') {
  //     resUtil.render(req, res, 'signup', {error: '信息不完整。', phone: phone});
  //     return;
  //   }
  //   logger.debug('check if phone is valid, phone: ' +  phone);
  //   if (!validator.isEmail(phone)) {
  //     resUtil.render(req, res, 'signup', {error: '不正确的手机号。', phone: phone});
  //     return;
  //   }
  //   logger.debug('check if captcha is valid, captcha: ' +  captcha);
  //   if (!validator.isEmail(captcha)) {
  //     resUtil.render(req, res, 'signup', {error: '图形验证码不正确。', captcha: captcha});
  //     return;
  //   }
  //   logger.debug('check if sms is valid, captcha: ' +  sms);
  //   if (!validator.isEmail(sms)) {
  //     resUtil.render(req, res, 'signup', {error: '手机验证码不正确。', sms: sms});
  //     return;
  //   }
  // }
  
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