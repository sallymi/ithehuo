/**
 * Provide email functionality
 *
 * @module utils/mail
 *
 */
var mailer = require("nodemailer");
var Q = require('q');
var config = require('../config');
var crypto = require('./crypto');
var logger = require('./log').getLogger('utils/mail.js');


var SITE_ROOT_URL = 'http://' + config.host;

/**
 * Send an email
 *
 * @function
 * @private
 * @param {String} to - target email address
 * @param {String} subject - email subject
 * @param {String} html - html email body
 *
 */
function sendMail(to, subject, html) {
  return Q.Promise(function (resolve, reject) {
    var mailerConfig = config.mailer;
    var smtpTransport = mailer.createTransport('SMTP', mailerConfig);// create reusable transport method (opens pool of SMTP connections)
    var mailOption = {
      'from': config.name + '开发团队 ' + mailerConfig.auth.user,
      'to': to,
      'subject': subject,
      'html': html
    };
    smtpTransport.sendMail(mailOption, function (err) {
      if (err) {
        logger.error('failed to send email to: ' + mailOption.to);
        logger.error(err);
        smtpTransport.close(); // shut down the connection pool, no more messages
        reject(err);
      }
      resolve();
    });
  });
}

/**
 * Send active mail
 *
 * @function
 * @param {String} email - target email address
 *
 */
exports.sendActiveMail = function (email) {
  return Q.Promise(function (resolve, reject) {
    var siteName = config.name;
    var siteContactMail = config.mailer.auth.user;
    var encodedEmail = crypto.base64Encode(email);
    var ticket = crypto.md5(email + config.secret);
    var activeUrl = SITE_ROOT_URL + '/active?email=' + encodedEmail + '&ticket=' + ticket;

    var to = email;
    var subject = '激活您的' + siteName + '帐号';
    var html =
      '<p>您好：<p/>' +
      '<p>感谢您注册' + siteName + '。<p/>' +
      '<p>您的登录邮箱为：' + email + ' 。请点击下面的链接激活帐户：</p>' +
      '<a href="' + activeUrl + '">' + activeUrl + '</a>' +
      '<p>如果以上链接无法点击，请将上面的地址复制到你的浏览器(如IE)的地址栏进入' + siteName + '。</p>' +
      '<p style="padding-top: 20px">' + siteName + '开发团队</p>' +
      '<p>' + siteContactMail + '</p>';

    sendMail(to, subject, html).then(function () {
      resolve(email);
    }).fail(function (err) {
      reject(err);
    });
  });
}
  /**
 * Send reset pwd mail
 *
 * @function
 * @param {String} email - target email address
 *
 */
exports.sendResetPwdMail = function (email,newPW) {
  return Q.Promise(function (resolve, reject) {
    var siteName = config.name;
    var siteContactMail = config.mailer.auth.user;
    var encodedEmail = crypto.base64Encode(email);
    var ticket = crypto.md5(email + config.secret);
    var activeUrl = SITE_ROOT_URL + '/reset?email=' + encodedEmail + '&ticket=' + ticket;

    var to = email;
    var subject = '重置您的' + siteName + '密码';
    var html =
      '<p>您好：<p/>' +
      '<p>' + siteName + '已经收到了你的找回密码请求，请点击下面的链接重置密码。<p/>' +
      '<a href="' + activeUrl + '">' + activeUrl + '</a>' +
      '<p style="padding-top: 20px">' + siteName + '开发团队</p>' +
      '<p>' + siteContactMail + '</p>';

    sendMail(to, subject, html).then(function () {
      resolve(email);
    }).fail(function (err) {
      reject(err);
    });
  });
}
