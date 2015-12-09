/**
 * Define message schema
 *
 * @module persistent/model/message
 *
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  /**
   * 消息是否已读
   */
  'read': {'type': Boolean, 'default': false},
  /**
   * 消息发送时间
   */
  'timestamp': {'type': Date, 'default': Date.now},
  /**
   * 消息发送者
   */
  'from': { 'type': Schema.Types.ObjectId, 'ref': 'User'},
  /**
   * 消息接收者
   */
  'to': {'type': Schema.Types.ObjectId, 'ref': 'User'},
  /**
   * 消息内容
   */
  'msg': String
});


/**
 * Constructor to create message data object
 *
 * @constructor Message
 *
 */
module.exports = mongoose.model('Message', schema);