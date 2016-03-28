/**
 * Provide response functionality
 *
 * @module utils/response
 *
 */

/**
 * Render a page, add user to the render object if user has signined
 *
 * @function
 * @param {Request} req - nodejs http request
 * @param {Response} res - nodejs http response
 * @param {String} page - page name
 * @param {Object} object - object to render page
 *
 */
exports.render = function (req, res, page, object) {
  if (req.session.user) {
    if (!object) {
      object = {};
    }
    object.signinUser = req.session.user;
    object.oss = global.oss;
    object.limit = global.limit;
  }
  res.render(page, object);
};

/**
 * Response a successfull operation result as a json
 *
 * @function
 * @param {Response} res - express http response
 * @param {String} [msg = 操作成功] - response message, to be shown to users
 * @param {Object} [data = null] - business data
 * @param {Number} [code = 200] - http response code
 *
 */
exports.okJson = function (res, msg, data, code) {
  var response = {
    'msg': msg || '操作成功',
    'data': data || null
  };
  res.status(code || 200).json(response);
};

/**
 * Response a failed operation result as a json
 *
 * @function
 * @param {Response} res - express http response
 * @param {String} [msg = 操作失败] - response message, to be shown to users
 * @param {Error} [error = null] - error due to the failed operation
 * @param {Number} [code = 500] - http response code
 *
 */
exports.errJson = function (res, msg, error, code) {
  var response = {
    'msg': msg || '操作失败',
    'err': error || null
  };
  res.status(code || 500).json(response);
};