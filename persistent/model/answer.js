/**
 * Define answer schema
 *
 * Question and answer relations are defined in answer,
 * no relation information stored in question.
 *
 * @module persistent/model/answer
 *
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  'question': { 'type': Schema.Types.ObjectId, 'ref': 'Question'},
  'created_by': {'type': Schema.Types.ObjectId, 'ref': 'User'},
  'created_at': {'type': Date, 'default': Date.now}, //创建时间
  'updated_at': {'type': Date, 'default': Date.now}, //更新时间
  'content': String,//答案内容
  'agrees': [{'user': { 'type': Schema.Types.ObjectId, 'ref': 'User'}}], //同意
  'opposes': [{'user': { 'type': Schema.Types.ObjectId, 'ref': 'User'}}], //反对
  'favs':  Number,//收藏次数
  'score': Number,
  'views': Number,//浏览次数
  'comment': [{
    'created_by': {'type': Schema.Types.ObjectId, 'ref': 'User'},
    'content': String, //评论内容
    'created_at': {'type': Date, 'default': Date.now}, //创建时间
    'updated_at': {'type': Date, 'default': Date.now} //更新时间
  }]
});


/**
 * Constructor to create Answer data object
 *
 * @constructor Answer
 *
 */
module.exports = mongoose.model('Answer', schema);