/**
 * Define add friend request schema
 *
 * @module persistent/model/request
 *
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  /**
   * 请求状态
   * pending: 等待响应
   * accepted: 已接受
   * denied: 已拒绝
   * expired: 已过期
   * ignored: 已忽略
   */
  'status': { 'type': String, 'default': 'pending' },
  /**
   * 创建时间，请求创建时自动添加系统时间
   */
  'creation_time': {
    'type': Date,
    'default': Date.now
  },
  /**
   * 请求发起者
   */
  'requestor': { 'type': Schema.Types.ObjectId, 'ref': 'User' },
  /**
   * 请求发起者发出的验证信息
   */
  'request_msg': String,
  /**
   * 请求目标，即被请求者
   */
  'target': { 'type': Schema.Types.ObjectId, 'ref': 'User' },
  /**
   * 回复时间
   */
  'response_time': { 'type': Date },
  /**
   * 回复附加信息
   */
  'response_msg': String
});

/**
 * Constructor to create add friend request data object
 *
 * @constructor Request
 *
 */
module.exports = mongoose.model('Request', schema);