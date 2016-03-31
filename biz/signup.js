/**
 * Handle sign up requests
 *
 * @module biz/signup
 *
 */
var validator = require('validator');
var userProxy = require('../persistent/proxy/user');
var config = require('../config');
var sms_config = config.sms.production;
var resUtil = require('../utils/response');
var crypto = require('../utils/crypto');
var mailer = require('../utils/mail');
var logger = require('../utils/log').getLogger('biz/signup');
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

var capText = null;
global.smsMap = {};
function MathRandom(){
  var Num="";
  for(var i=0;i<6;i++)
  {
    Num+=Math.floor(Math.random()*10);
  }
  return Num;
}
exports.showSignupPage = function (req, res) {
  resUtil.render(req, res, 'signup');

};
exports.sms = function (req, res, next) {
  var registry = req.body.registry;
  var phone = req.params.phone?req.params.phone:req.body.phone;
  var type = req.body.type;
  var smsText = MathRandom();
  logger.debug('get the phone number');
  logger.debug('the sms text is==='+smsText);
  //var app = new App('23324086', '701378360789f40887a0db9905d11252');
  var app = new App(sms_config.ID,sms_config.Key);
  var template="";
  var sign_name="";
  switch (type) {
    case 'resetPwd':
      sign_name=sms_config.resetPwd.sign_name;
      template=sms_config.resetPwd.template;
      //sign_name='变更验证';
      break;
    default:
      sign_name=sms_config.default.sign_name;
      template=sms_config.default.template;
      //sign_name='注册验证';
  }
  // global.smsMap[phone]=smsText;
  // logger.debug(global.smsMap);
  // logger.debug(sign_name, template);

  // if(registry){
  //   //更改密码
  //   next({success:true})
  // }else{
  //   //注册
  //   resUtil.okJson(res, '已发送');
  // }
  logger.debug(sign_name, template);
  app.smsSend({
      sms_free_sign_name: sign_name, //短信签名，参考这里 http://www.alidayu.com/admin/service/sign
      sms_param: JSON.stringify({"code": smsText, "product": "［IT合伙人］"}),//短信变量，对应短信模板里面的变量
      rec_num: phone, //接收短信的手机号
      sms_template_code: template//'SMS_5495196' //短信模板，参考这里 http://www.alidayu.com/admin/service/tpl
  }, function(result){
    logger.debug(result);
    global.smsMap[phone]=smsText;
    logger.debug(global.smsMap);
    if(registry){
      //更改密码
      next({success:true})
    }else{
      //注册
      resUtil.okJson(res, '已发送');
    }
  });
};

exports.captcha = function (req, res) {
    //return res.send('A');
    var ary = ccap.get();
    capText= ary[0];
    var buf = ary[1];
    logger.debug("now ccap is==="+capText);
    req.session.capText = capText;
    logger.debug(req.session.capText);
    res.set('Content-Type', 'image/jpeg');
    res.send(buf);
};

exports.checkPhoneUsed = function (req, res) {
  var phone = req.body.phone;
  userProxy.findUserByPhone(phone).then(function (user) {
    if (user) {
      logger.debug('The phone number ' + phone + ' is registered');
      res.status(200).json({errCode:100001,msg:'the phone is registered'})
    }else{
      logger.debug('The phone number ' + phone + ' is registered');
      res.status(200).json({errCode:0,msg:'the phone is not registered'})
    }
  })
}
exports.signup = function (req, res) {
  logger.debug('request received to sign up');
  logger.debug(JSON.stringify(req.body));
  var email = req.body.email;
  var pass = req.body.password;
   var phone = req.body.phone;
   var captcha = req.body.captcha;
   var sms = req.body.sms;

   if(email){
     logger.debug('check if email, password and re_password are all set');
     if (email === '' || pass === '') {
       resUtil.render(req, res, 'signup', {error: '信息不完整。', email: email});
       return;
     }
     logger.debug('check if email is valid, email: ' +  email);
     if (!validator.isEmail(email)) {
       resUtil.render(req, res, 'signup', {error: '不正确的电子邮箱。', email: email});
       return;
     }

     logger.debug('check if password length >= 8');
     if (pass.length < 8) {
       resUtil.render(req, res, 'signup', {error: '密码长度必须大于或等于8位', email: email});
       return;
     }

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

   }else{
     logger.debug('check if phone, captcha and sms are all set');
     if (phone === '' || captcha === '' || sms==='') {
       resUtil.render(req, res, 'signup', {error: '信息不完整。', phone: phone});
       return;
     }
     logger.debug('check if phone is valid, phone: ' +  phone);
     if (!validator.isMobilePhone(phone,'zh-CN')) {
       resUtil.render(req, res, 'signup', {error: '不正确的手机号。', phone: phone});
       return;
     }
     logger.debug('check if captcha is valid, captcha: ' +  captcha + ' with generated Code '+req.session.capText);
     if (req.session.capText.toLowerCase()!=captcha.toLowerCase()) {
       resUtil.render(req, res, 'signup', {error: '图形验证码不正确。', captcha: captcha});
       return;
     }
     logger.debug('check if sms is valid, smsText: ' +  sms);
     logger.debug(global.smsMap);
     if (global.smsMap[phone]!=sms) {
       resUtil.render(req, res, 'signup', {error: '手机验证码不正确。', sms: sms});
       return;
     }

     logger.debug('check if password length >= 8');
     if (pass.length < 8) {
       resUtil.render(req, res, 'signup', {error: '密码长度必须大于或等于8位', email: email});
       return;
     }

     userProxy.findUserByPhone(phone).then(function (user) {
       if (user) {
        logger.debug('The phone number '+phone+' is registried');
         resUtil.render(req, res, 'signup', {error: '该号码已经注册。', phone: user.mobile_phone});

       } else {
         logger.debug('all check passed');

         var password = crypto.md5(pass);

         logger.debug('try to create user');
         return userProxy.createUser({
           'mobile_phone': phone,
           'password': password,
           'active': true
         }).then(function (user) {
           resUtil.render(req, res, 'signup', {
             success: '欢迎加入IT合伙人！注册成功，请返回首页登陆！'
           });
         });
       }
     }).fail(function (err) {
       logger.error(err);
       resUtil.render(req, res, 'signup', {error: '出错啦，请稍后再试'});
     });
   }

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

exports.reset = function (req, res) {
  logger.debug('request received to reset password');
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
      logger.debug('ready to reset password, user email: ' + user.email);
      resUtil.render(req, res, 'user_reset',{user:email});
    }).fail(function (err) {
      logger.error(err);
      resUtil.render(req, res, 'user_reset', {error: '重置失败'});
    });
  }
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
  var newPwd = pass && pass.new_pwd;
  var newPwdVerify = pass && pass.new_pwd_verify;

 
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

  var user = pass.user;
  userProxy.findUserByEmail(user).then(function (user) {

    logger.info('[check] if user exist');
    if (!user) {
      logger.info('[failed] will response with error message');
      resUtil.errJson(res, '出错啦，请重新登录后再试');
      return;
    }
    logger.info('[pass]');

    logger.info('[all check pass] begin update password');
    user.password = crypto.md5(newPwd);
    userProxy.saveUser(user).then(function () {
      logger.info('password saved, will resoponse with success message');
      req.session.user = user.toObject();
      // res.redirect('/');
      resUtil.okJson(res, '操作成功，密码已修改');
    });

  }).fail(function (error) {
    logger.error('failed to modify user password due to bellow error');
    logger.error(error);
    resUtil.errJson(res, '操作失败啦，请稍后再试 :(', error);
  });
};