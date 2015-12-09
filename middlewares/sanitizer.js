/**
 * provide the sanitizer filter for request payload
 *
 * @module middlewares/sanitizer
 *
 */
var sanitizer = require('sanitizer');

/**
 * sanitize the json object for html tags to avoid xss attack
 *
 * @function
 * @private
 * @param {JSON} json - object to be santized
 *
 */
function sanitizeRecursively(json) {
  var key;
  for (key in json) {
    if (typeof json[key] === 'object') {
      json[key] = sanitizeRecursively(json[key]);
    } else if (typeof json[key] === 'string') {
      json[key] = sanitizer.sanitize(json[key]).trim();
    }
  }
  return json;
}

/**
 * middleware to filter html tags in request to avoid xss attack
 *
 * @function
 * @param {Object} req - express request
 * @param {Object} res - express response
 * @param {Function} next - the call back to invke next middeware
 *
 */
exports.sanitizeFilter = function (req, res, next) {
  if (req.body) {
    req.body = sanitizeRecursively(req.body);
  }
  next();
};