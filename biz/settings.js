/**
 * Handle recruitment requests
 *
 * @module biz/recruitment
 *
 */

var resUtil = require('../utils/response');
var reqUtil = require('../utils/request');
var crypto = require('../utils/crypto');
var userProxy = require('../persistent/proxy/user.js');
var logger = require('../utils/log').getLogger('biz/settings.js');
var validator = require('validator');

/**
 * Request handler for change password page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.changePasswordPage = function (req, res) {
  logger.info('request received to user home - user profile page, requester email: ' + reqUtil.getUserEmail(req));
  logger.info('will render user_home_setting_password page with the user in session');
  resUtil.render(req, res, 'user_home_setting_password', {
    title: '更新密码'
  });
};

/**
 * Request handler for change password request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.changePassword = function (req, res) {
  logger.info('request received to change password');
  var pass = req.body;

  var currentPwd = pass && pass.current_pwd;
  var newPwd = pass && pass.new_pwd;
  var newPwdVerify = pass && pass.new_pwd_verify;

  logger.info('[check] if current password is set');
  if (!currentPwd) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '当前密码字段不能为空', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.info('[check] if new password is set');
  if (!newPwd) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '新密码不能为空', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.info('[check] if new password verify is set');
  if (!newPwdVerify) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '重复新密码不能为空', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.info('[check] if new password equals to new password verify');
  if (newPwd !== newPwdVerify) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '两次输入的新密码不一致', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.info('[check] if new password length >= 8');
  if (newPwd.length < 8) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '新密码长度必须大于8位', null, 406);
    return;
  }
  logger.info('[pass]');

  var uid = reqUtil.getUserId(req);
  userProxy.findUserById(uid).then(function (user) {

    logger.info('[check] if user exist');
    if (!user) {
      logger.info('[failed] will response with error message');
      resUtil.errJson(res, '出错啦，请重新登录后再试');
      return;
    }
    logger.info('[pass]');

    logger.info('[check] if current password correct');
    if (user.password !== crypto.md5(currentPwd)) {
      logger.info('[failed] will response with error message');
      resUtil.errJson(res, '当前密码有误', null, 406);
      return;
    }
    logger.info('[pass]');

    logger.info('[all check pass] begin update password');
    user.password = crypto.md5(newPwd);
    userProxy.saveUser(user).then(function () {
      logger.info('password saved, will resoponse with success message');
      resUtil.okJson(res, '操作成功，密码已修改');
    });

  }).fail(function (error) {
    logger.error('failed to modify user password due to bellow error');
    logger.error(error);
    resUtil.errJson(res, '操作失败啦，请稍后再试 :(', error);
  });
};

/**
 * Request handler for change email page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.changeEmailPage = function (req, res) {
  logger.info('request received to user home - user profile page, requester email: ' + reqUtil.getUserEmail(req));
  logger.info('will render settings_account page with the user in session');
  var uid = reqUtil.getUserId(req);
  userProxy.findUserById(uid).then(function (user) {
  	resUtil.render(req, res, 'user_home_setting_email', {
  	current_email: user.email,
    title: '修改邮箱'
  });
  });
  
};

/**
 * Request handler for change email request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.changeEmail = function (req, res) {
  logger.info('request received to change email');
  var update = req.body;
  var newEmail = update.email;
  var newEmailVerify = update.email_verify;
  var password = update.password;

  logger.info('[check] if new email is set');
  if (!newEmail) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '新邮箱不能为空', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.info('[check] if new email verify is set');
  if (!newEmailVerify) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '确认新邮箱不能为空', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.info('[check] if password is set');
  if (!password) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '密码不能为空', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.info('[check] if new email equals to new email verify');
  if (newEmail !== newEmailVerify) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '两次输入的邮箱不一致', null, 406);
    return;
  }
  logger.info('[pass]');

  userProxy.findUserByEmail(newEmail).then(function (user) {

    logger.info('[check] if new email is taken by others');
    if (user) {
      logger.info('[failed] will response with error message');
      resUtil.errJson(res, '邮箱已经被占用', null, 406);
      return;
    }
    logger.info('[pass]');

    var uid = reqUtil.getUserId(req);
    userProxy.findUserById(uid).then(function (user) {

      logger.info('[check] if user exist');
      if (!user) {
        logger.info('[failed] will response with error message');
        resUtil.errJson(res, '出错啦，请重新登录后再试');
        return;
      }
      logger.info('[pass]');

      logger.info('[check] if password correct');
      if (user.password !== crypto.md5(password)) {
        logger.info('[failed] will response with error message');
        resUtil.errJson(res, '密码有误', null, 406);
        return;
      }
      logger.info('[pass]');

      logger.info('[all check pass] begin update email'); 
      var currentEmailPattern = new RegExp(user.email, 'i');
      if (user.emails_used.toString().search(currentEmailPattern) === -1) {
        user.emails_used.push(user.email);
      }
      user.email = newEmail;
      userProxy.saveUser(user).then(function () {
        logger.info('password saved, will resoponse with success message');
        req.session.user.email = newEmail;
        resUtil.okJson(res, '操作成功，邮箱已修改');
      });

    });
  }).fail(function (error) {
    logger.error('failed to modify user password due to bellow error');
    logger.error(error);
    resUtil.errJson(res, '操作失败啦，请稍后再试 :(', error);
  });
};

/**
 * Request handler for change email page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.changeMobilePage = function (req, res) {
  logger.info('request received to user home - user profile page, requester email/phone: ' + reqUtil.getUserEmail(req)?reqUtil.getUserEmail(req):reqUtil.getUserMobile(req));
  logger.info('will render settings_account page with the user in session');
  var uid = reqUtil.getUserId(req);
  userProxy.findUserById(uid).then(function (user) {
    resUtil.render(req, res, 'user_home_setting_mobile', {
    current_mobile: user.mobile_phone,
    title: '修改电话'
  });
  });
  
};

/**
 * Request handler for change email request
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.changeMobile = function (req, res) {
  logger.info('request received to change mobile');
  var update = req.body;
  var newMobile = update.mobile;
  var sms = req.body.sms;
  var password = update.password;

  logger.info('[check] if new phone is set');
  if (!newMobile) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '新手机号码不能为空', null, 406);
    return;
  }
  logger.info('[pass]');

  logger.debug('check if phone and sms are all set');
   if (newMobile === '' || sms==='') {
    logger.info('[failed] will response with error message');
     resUtil.errJson(res, '信息不完整', null, 406);
     return;
  }
  logger.info('[pass]');
  logger.info('[check] if password is set');
  if (!password) {
    logger.info('[failed] will response with error message');
    resUtil.errJson(res, '密码不能为空', null, 406);
    return;
  }
  logger.info('[pass]');
 logger.debug('check if phone is valid, phone: ' +  newMobile);
 if (!validator.isMobilePhone(newMobile,'zh-CN')) {
  logger.info('[failed] will response with error message');
   resUtil.errJson(res, '不正确的手机号', null, 406);
   return;
 }
    logger.info('[pass]');
   logger.debug('check if sms is valid, sms: ' +  sms + ' with globalsmsText:'+global.smsMap[newMobile]);
   if (global.smsMap[newMobile]!=sms) {
    logger.info('[failed] will response with error message');
     resUtil.errJson(res, '验证码不正确', null, 406);
     return;
   }
   logger.info('[pass]');

  userProxy.findUserByPhone(newMobile).then(function (user) {

    logger.info('[check] if new phone is taken by others');
    if (user) {
      logger.info('[failed] will response with error message');
      resUtil.errJson(res, '号码已经被占用', null, 406);
      return;
    }
    logger.info('[pass]');

    var uid = reqUtil.getUserId(req);
    userProxy.findUserById(uid).then(function (user) {

      logger.info('[check] if user exist');
      if (!user) {
        logger.info('[failed] will response with error message');
        resUtil.errJson(res, '出错啦，请重新登录后再试');
        return;
      }
      logger.info('[pass]');

      logger.info('[check] if password correct');
      if (user.password !== crypto.md5(password)) {
        logger.info('[failed] will response with error message');
        resUtil.errJson(res, '密码有误', null, 406);
        return;
      }
      logger.info('[pass]');

      logger.info('[all check pass] begin update phone'); 
      user.mobile_phone = newMobile;
      userProxy.saveUser(user).then(function () {
        logger.info('password saved, will resoponse with success message');
        req.session.user.mobile_phone = newMobile;
        resUtil.okJson(res, '操作成功，电话已修改');
      });

    });
  }).fail(function (error) {
    logger.error('failed to modify user password due to bellow error');
    logger.error(error);
    resUtil.errJson(res, '操作失败啦，请稍后再试 :(', error);
  });
};

