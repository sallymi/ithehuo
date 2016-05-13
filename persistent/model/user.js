/**
 * Define user schema
 *
 * @module persistent/model/user
 *
 */
var mongoose = require('mongoose');
var dateUtil = require('../../utils/date');

var Schema = mongoose.Schema;
var schema = new Schema({
  /**
   * 是否已激活，目前只支持邮件激活
   * true: 已经激活
   * false: 尚未激活
   */
  'active': {
    'type': Boolean,
    'default': false
  },
  /**
   * 是否显示在用户列表
   * true: 显示
   * false: 不显示
   */
  'display': {
    'type': Boolean,
    'default': false
  },
  /**
   * 是否是置顶
   * true: 是
   * false: 否
   */
  'top': {
    'type':Number,
    'default':-1
  },
  /**
   * 创建时间，用户创建时自动添加系统时间
   */
  'creation_time': {
    'type': Date,
    'default': Date.now
  },
  /**
   * 邮箱，用作用户登录
   */
  'email': String,
  /**
   * 微信统一id，用作用户登录
   */
  'unionid': String,
  /**
   * 曾使邮箱列表，用于后期管理
   */
  'emails_used': [String],
  /**
   * 密码
   */
  'password': String,
  /**
   * 姓名
   */
  'name': String,
  /**
   * 昵称
   */
  'nick_name': String,
  /**
   * 年龄
   */
  'age': Number,
  /**
   * 头像url
   */
  'logo_img': String,
  /**
   * 手机号码
   */
  'mobile_phone': Number,
   /**
   * 个人描述
   */
  'description': String,
  /**
   * 所在城市
   */
  'location': String,
  /**
   * 家乡
   */
  'hometown': String,
  /**
   * 专注的领域
   * 互联网 | O2O | App等
   */
  'field': String,
  /**
   * 技能
   * Java | PHP | C++ | UI | 后端 | 数据库 | 用户体验 等
   */
  'skill': String,
  /**
   * 当前状态
   * 全职创业 | 兼职创业 | 没有任何创业
   */
  'status': String,
  /**
   * 角色
   * 创始人 | 技术合伙人| 产品设计合伙人 | 运营合伙人 | 市场营销合伙人 | 资源合伙人 | 资金合伙人
   */
  'role': String,
  /**
   * 创业倾向
   * 全职主导创业 | 全职参与创业 | 兼职创业
   */
  'prefer': String,
  /**
   * 技术经验
   * 不少于70字
   */
  'technical_experience': String,
  /**
   * 项目经验
   * 不少于70字
   */
  'project_experience': String,
  /**
   * 创业项目id列表
   * 在IT合伙人平台上登记的，是creator或partner
   */
  'projects': [{
    'type': Schema.Types.ObjectId,
    'ref': 'Project'
  }],
  /**
   * 创业经历
   * 可以是不在IT合伙人平台上登记，由创业者自己填写的
   */
  'startup_experiences': [
    {
      'start_time': Date,
      'end_time': Date,
      'role': String, //项目中的角色
      'name': String, //创业项目名称
      'description': String //创业项目描述
    }
  ],
  /**
   * 创业经历是否公开
   */
  'startup_experiences_public': Boolean,
  /**
   * 工作经历
   */
  'work_experiences': [
    {
      'start_time': Date,
      'end_time': Date,
      'corporation': String,
      'title': String, //职位或头衔
      'description': String
    }
  ],
  /**
   * 工作经历标签
   */
  'work_experiences_tags':[String],
  /**
   * 工作经历是否公开
   */
  'work_experiences_public': Boolean,
  /**
   * 教育经历
   */
  'educations': [
    {
      'start_time': Date,
      'end_time': Date,
      'school': String,
      'description': String
    }
  ],
  /**
   * 关注的问题列表
   */
  'fav_questions': [
    {
      'question': {'type': Schema.Types.ObjectId, 'ref': 'Question'},
      'fav_time': {'type': Date, 'default': Date.now},//收藏时间
    }
  ],
  /**
   * 收藏的答案列表
   */
  'fav_answers': [
    {
      'answer': {'type': Schema.Types.ObjectId, 'ref': 'Answer'},
      'fav_time': {'type': Date, 'default': Date.now},//收藏时间
    }
  ],
  /*
   * 关注的用户
   */
  'followings': [{ 'type': Schema.Types.ObjectId, 'ref': 'User'}]
});

schema.set('toObject', {
  getters: true,
  transform: function (doc, ret, options) {
    delete ret.password;
    var i;
    if (ret.educations) {
      for (i = 0; i < ret.educations.length; i++) {
        delete ret.educations[i]._id;
        ret.educations[i].start_time = dateUtil.format(ret.educations[i].start_time);
        ret.educations[i].end_time = dateUtil.format(ret.educations[i].end_time);
      }
    }
    if (ret.startup_experiences) {
      for (i = 0; i < ret.startup_experiences.length; i++) {
        delete ret.startup_experiences[i]._id;
        ret.startup_experiences[i].start_time = dateUtil.format(ret.startup_experiences[i].start_time);
        ret.startup_experiences[i].end_time = dateUtil.format(ret.startup_experiences[i].end_time);
      }
    }
    if (ret.work_experiences) {
      for (i = 0; i < ret.work_experiences.length; i++) {
        delete ret.work_experiences[i]._id;
        ret.work_experiences[i].start_time = dateUtil.format(ret.work_experiences[i].start_time);
        ret.work_experiences[i].end_time = dateUtil.format(ret.work_experiences[i].end_time);
      }
    }
  }
});

/**
 * Constructor to create User data object
 *
 * @constructor User
 *
 */
module.exports = mongoose.model('User', schema);