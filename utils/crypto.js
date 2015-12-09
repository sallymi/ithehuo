/**
 * Provide crypto functionality
 *
 * @module utils/crypto
 *
 */
var crypto = require('crypto');
var config = require('../config');

/**
 * Create a md5 digest
 *
 * @function
 * @param {String} str - data string to create digest
 * @return {String} md5 digest of the input data
 *
 */
exports.md5 = function (str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

/**
 * Encode string to base64
 *
 * @function
 * @param {String} str - string to encode
 * @return {String} encoded string
 *
 */
exports.base64Encode = function (str) {
  str = new Buffer(str, 'utf8').toString('base64');
  return str;
};

/**
 * Decode base64 string
 *
 * @function
 * @param {String} str - base64 string to decode
 * @return {String} decoded string
 *
 */
exports.base64Decode = function (str) {
  str = new Buffer(str, 'base64').toString('utf8');
  return str;
};

/**
 * Encrypt string using aes192 algorithm and secret in config
 *
 * @function
 * @param {String} str - string to encrypt
 * @return {String} encrypted string
 *
 */
exports.encrypt = function (str) {
  var cipher = crypto.createCipher('aes192', config.secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

/**
 * Decrypt string using aes192 algorithm and secret in config
 *
 * @function
 * @param {String} str - string to decrypt
 * @return {String} plain string
 *
 */
exports.decrypt = function (str) {
  var decipher = crypto.createDecipher('aes192', config.secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};