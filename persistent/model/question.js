/**
 * Define question model schema
 *
 * @module persistent/model/question
 *
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
  'expired': {'type': Boolean, 'default': false}, //是否已经过期
  'created_at': {'type': Date, 'default': Date.now}, //创建时间
  'updated_at': {'type': Date, 'default': Date.now}, //更新时间
  'created_by': {'type': Schema.Types.ObjectId, 'ref': 'User'},
  'title': String, //问题标题
  'content': String, //问题内容
  'tag': {'type': Schema.Types.ObjectId, 'ref': 'Tag'},//话题
  'type': String, //类型，运营 | 运维 | 管理 | 财务 | 开发 | 测试
  'views': Number,//浏览次数
  'favs': Number,//收藏次数
  'best_answer': {'type': Schema.Types.ObjectId, 'ref': 'Answer'},//最佳答案
  'anonymous': {'type': Boolean, 'default': false},//是否匿名发表
  'comment': [{
    'created_by': {'type': Schema.Types.ObjectId, 'ref': 'User'},
    'content': String, //评论内容
    'created_at': {'type': Date, 'default': Date.now}, //创建时间
    'updated_at': {'type': Date, 'default': Date.now} //更新时间
  }]
});

/**
 * Constructor to create Question data object
 *
 * @constructor Question
 *
 */
module.exports = mongoose.model('Question', questionSchema);