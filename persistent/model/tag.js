/**
 * Define tag model schema
 *
 * @module persistent/model/tag
 *
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagSchema = new Schema({
  'title':{'type':String},//话题
  'expired': {'type': Boolean, 'default': false}, //话题是否已经过期
  'created_at': {'type': Date, 'default': Date.now}, //创建时间
  'created_by': {'type': Schema.Types.ObjectId, 'ref': 'User'},
  'assigned':{'type':Boolean, 'default':false},//系统预置
  'click_count': {'type': Number, 'default': 0},//话题点击数
  'ask_count': {'type': Number, 'default': 0},//话题问题数
  'fav_count': {'type': Number, 'default': 0}//话题收藏数
});

/**
 * Constructor to create Answer data object
 *
 * @constructor Answer
 *
 */
module.exports = mongoose.model('Tag', TagSchema);