/**
 * Request util
 *
 * @module utils/request
 */
var logger = require('./log').getLogger('/utils/request.js');

/**
 * Get user id from request session
 *
 * @function
 * @param {Object} req - express http request
 * @return {String | undefine} user id or undefine
 *
 */
exports.getUserId = function (req) {
  logger.debug('try to get user id from session');
  logger.trace(req && req.session);
  var uid = req && req.session && req.session.user && req.session.user.id;
  logger.debug('user id: ' + uid);
  return uid;
};

/**
 * Get user email from request session
 *
 * @function
 * @param {Object} req - express http request
 * @return {String | undefine} user email or undefine
 *
 */
exports.getUserEmail = function (req) {
  logger.debug('try to get user email from session');
  logger.trace(req && req.session);
  var email = req && req.session && req.session.user && req.session.user.email;
  logger.debug('user email: ' + email);
  return email;
};

/**
 * Get user mobile phone from request session
 *
 * @function
 * @param {Object} req - express http request
 * @return {String | undefine} user email or undefine
 *
 */
exports.getUserMobile = function (req) {
  logger.debug('try to get user mobile from session');
  logger.trace(req && req.session);
  var mobile = req && req.session && req.session.user && req.session.user.mobile_phone;
  logger.debug('user mobile: ' + mobile);
  return mobile;
};



/**
 * Get user hometown
 *
 * @function
 * @param {Object} req - express http request
 * @return {String | undefine} user hometown or undefine
 *
 */
exports.getUserHometown = function (req) {
  logger.debug('try to get user hometown from session');
  logger.trace(req && req.session);
  var hometown = req && req.session && req.session.user && req.session.user.hometown;
  logger.debug('user hometown: ' + hometown);
  return hometown;
};

/**
 * Get user corporations
 *
 * @function
 * @param {Object} req - express http request
 * @return {Array} user corporations name array
 *
 */
exports.getUserCorporations = function (req) {
  logger.debug('try to get user corporations from session');
  logger.trace(req && req.session);
  var corporations = [];
  var work_experiences = req && req.session && req.session.user && req.session.user.work_experiences;
  if (work_experiences) {
    var i;
    for (i = 0; i < work_experiences.length; i++) {
      corporations.push(work_experiences[i].corporation);
    }
  }
  logger.debug('user corporations: ' + corporations);
  return corporations;
};

/**
 * Get user schools
 *
 * @function
 * @param {Object} req - express http request
 * @return {Array} user corporations name array
 *
 */
exports.getUserSchools = function (req) {
  logger.debug('try to get user corporations from session');
  logger.trace(req && req.session);
  var schools = [];
  var educations = req && req.session && req.session.user && req.session.user.educations;
  if (educations) {
    var i;
    for (i = 0; i < educations.length; i++) {
      schools.push(educations[i].school);
    }
  }
  logger.debug('user schools: ' + schools);
  return schools;
};

/**
 * Get user original url from request session
 *
 * @function
 * @param {Object} req - express http request
 * @return {String | undefine} original or undefine
 *
 */
exports.getOriginalUrl = function (req) {
  logger.debug('try to get original url from session');
  logger.trace(req && req.session);
  var originalUrl = req && req.session && req.session.originalUrl;
  logger.debug('user original url: ' + originalUrl);
  return originalUrl;
};

/**
 * Get signin redirect url from request session
 *
 * @function
 * @param {Object} req - express http request
 * @return {String | undefine} redirect url or undefine
 *
 */
exports.getRedirectUrl = function (req) {
  logger.debug('try to get redirect url from session');
  logger.trace(req && req.session);
  var redirectUrl = req && req.session && req.session.redirectUrl;
  logger.debug('user original url: ' + redirectUrl);
  return redirectUrl;
};