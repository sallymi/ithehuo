/**
 * Define relation schema
 *
 * @module persistent/model/relation
 *
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  /**
   * 创建时间，关系创建时自动添加系统时间
   */
  'creation_time': {
    'type': Date,
    'default': Date.now
  },
  /**
   * 好友请求
   */
  'request': {
    'type': Schema.Types.ObjectId,
    'ref': 'Request'
  },
  /**
   * 关系双方
   */
  'users': [{
    'type': Schema.Types.ObjectId,
    'ref': 'User'
  }]
});

/**
 * Constructor to create relation data object
 *
 * @constructor Relation
 *
 */
module.exports = mongoose.model('Relation', schema);