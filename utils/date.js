/**
 * Request util
 *
 * @module utils/date
 */

var zeroize = function (value, length) {
  if (!length) {
    length = 2;
  }
  var i;
  var zeros = '';
  value = String(value);
  for (i = 0; i < (length - value.length); i++) {
    zeros += '0';
  }
  return zeros + value;
};

/**
 * formate date
 *
 * @function
 * @param {Date} date - date object
 * @return {String} date string
 *
 */
exports.format = function (date) {

  if (date instanceof Date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return zeroize(y, 4) + '-' + zeroize(m) + '-' + zeroize(d);
  }

  return date;
};