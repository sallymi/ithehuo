/**
 * provide the auth functionality
 *
 * @module middlewares/auth
 *
 */
var basicAuth = require('basic-auth');
var userProxy = require('../persistent/proxy/user');
var crypto = require('../utils/crypto');
var reqUtil = require('../utils/request');
var logger = require('../utils/log').getLogger('middlewares/auth.js');
var config = require('../config');
/**
 * middleware to sign in auth
 *
 * @function
 * @param {Object} req - express request
 * @param {Object} res - express response
 * @param {Function} next - the call back to invoke next middleware
 *
 */
exports.signinAuth = function (req, res, next) {
  logger.debug('check if user in session');
  if (reqUtil.getUserId(req)) {
    logger.debug('user exist in session, will pass control to next handler');
    next();
    return;
  }
  logger.debug('user not found in session');

  logger.debug('check if uid in cookie');
  var cookies = req.cookies;
  var uid = cookies.ithhr_uid;
  if (uid) {
    logger.debug('uid found in cookie, uid: ' + uid);
    logger.debug('try to decrypt uid in cookie');
    var email;
    try {
      email = crypto.decrypt(uid);
      logger.debug('email decrypted from cookie, email: ' + email);

      logger.debug('try to find user in db');
      userProxy.findUserByEmail(email).then(function (user) {
        if (user) {
          logger.debug('user found, will store user in session and pass control to next handler');
          req.session.user = user.toObject();
          next();
          return;
        }
      }).fail(function (err) {
        logger.error('error occur when try to find user by email');
        logger.error(err);
        logger.debug('redirect to sigin page');
        res.redirect('/signin');
        return;
      });
    } catch (e) {
      logger.error('error occur when try to decript uid in cookie');
      logger.error(e);
      logger.debug('redirect to sigin page');
      res.redirect('/signin');
      return;
    }
  }
  logger.debug('uid NOT found in cookie');

  logger.debug('unauthenticated user try to access protected recource');
  logger.debug('store original url in session');
  req.session.originalUrl = req.originalUrl;

  logger.debug('redirect user to signin page');
  res.redirect('/signin');
};

/**
 * middleware to sign in auth for administrator
 *
 * @function
 * @param {Object} req - express request
 * @param {Object} res - express response
 * @param {Function} next - the call back to invoke next middleware
 *
 */
exports.signinAuthforAdmin = function (req, res, next) {
  logger.debug('check if user in session');
  var uid = req && req.session && req.session.user && req.session.user.id;
  var user = req && req.session && req.session.user;
  if (user) {
    logger.debug('user exist in session, will pass control to next handler');
     if(-1 !== config.admin.indexOf(user.email) || config.admin.indexOf(user.mobile_phone)){
      console.log("here")
        next();
        return;
      }else{
        console.log("here1")
        res.redirect('/');
      }
  }
  logger.debug('user not found in session');

  logger.debug('check if uid in cookie');
  var cookies = req.cookies;
  uid = cookies.ithhr_uid;
  if (uid) {
    logger.debug('uid found in cookie, uid: ' + uid);
    logger.debug('try to decrypt uid in cookie');
    var email;
    try {
      email = crypto.decrypt(uid);
      logger.debug('email decrypted from cookie, email: ' + email);

      logger.debug('try to find user in db');
      userProxy.findUserByEmail(email).then(function (user) {
        if (user) {
          logger.debug('user found, will store user in session and pass control to next handler');
          req.session.user = user.toObject();
          if(-1 !== config.admin.indexOf(user.email)|| config.admin.indexOf(user.mobile_phone)){
            next();
            return;
          }else{
            res.redirect('/');
          }
          
        }
      }).fail(function (err) {
        logger.error('error occur when try to find user by email');
        logger.error(err);
        logger.debug('redirect to sigin page');
        res.redirect('/signin');
        return;
      });
    } catch (e) {
      logger.error('error occur when try to decript uid in cookie');
      logger.error(e);
      logger.debug('redirect to sigin page');
      res.redirect('/signin');
      return;
    }
  }
  logger.debug('uid NOT found in cookie');

  logger.debug('unauthenticated user try to access protected recource');
  logger.debug('store original url in session');
  req.session.originalUrl = req.originalUrl;

  logger.debug('redirect user to signin page');
  res.redirect('/signin');
};

/**
 * middleware to basic authentication
 *
 * @function
 * @param {Object} req - express request
 * @param {Object} res - express response
 * @param {Function} next - the call back to invoke next middleware
 *
 */
exports.basic = function (req, res, next) {
  logger.debug('request received that need basic auth');
  var credentials = basicAuth(req);
  if (!credentials || credentials.name !== 'ithhr' || crypto.md5(credentials.pass) !== 'bcf529ee4304c5eb441de80a49af3e9c') {
    res.set('WWW-Authenticate', 'Basic realm="IT合伙人"');
    res.status(401).end();
  } else {
    logger.debug('basic auth done, will pass control to next handler');
    next();
  }
};