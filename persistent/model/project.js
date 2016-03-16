/**
 * Define project schema
 *
 * @module persistent/model/project
 *
 */

var mongoose = require('mongoose');
var dateUtil = require('../../utils/date');

var Schema = mongoose.Schema;
var schema = new Schema({
  /**
   * 项目状态
   * public: 公开项目，对所有人可见，默认值
   * private: 私有项目，只对创建者可见
   * delete: 项目已经被创建者删除
   */
  'status': {
    'type': String,
    'default': 'public'
  },
  /**
   * 是否推荐到首页
   * true: 是
   * false: 否
   */
  'recommended': {
    'type': Boolean,
    'default': false
  },
  /**
   * 是否是hot项目
   * true: 是
   * false: 否
   */
  'hot': {
    'type': Boolean,
    'default': false
  },
  /**
   * 是否是hot项目
   * true: 是
   * false: 否
   */
  'like': {
    'type': Number,
    'default': 0
  },
  /**
   * 创建时间，项目创建时自动添加系统时间
   */
  'creation_time': {
    'type': Date,
    'default': Date.now
  },
  /**
   * 项目名称
   */
  'name': String,
  /**
   * 项目关键，一句话描述
   */
  'keyword' : String,
  /**
   * 项目标记，用户自己给项目添加的标记
   * 例如，互联网，移动互联网，天使轮，A轮，常春藤学校毕业，O2O等
   * 用作其他用户对项目方向的检索
   */
  'tag': [ String ],
  /**
   * 项目阶段，项目目前处于什么阶段
   * 可选值为：
   * 想法构思
   * 正在实现
   * 测试版已发布
   * 正式版已发布
   */
  'stage': String,
  /**
   * 项目描述
   */
  'description': String,
  /**
   * 项目logo地址
   */
  'logo_img': String,
  /**
   * 项目所属公司名称
   */
  'company': String,
  /**
   * 项目需要的技能
   */
  'required_skills': String,
  /**
   * 项目展示链接
   */
  'link': String,
  /**
   * 项目所在城市
   */
  'location': String,
  /**
   * 项目合伙人列表
   */
  'partners': [{
    // 合伙人在项目中的角色
    'role': String,
    // 合伙人在系统中的id
    'user': {
      'type': Schema.Types.ObjectId,
      'ref': 'User'
    }
  }],
  /**
   * 项目融资情况
   */
  'funding': {
    // 项目当前融资规模 1-50 | 51-500 | 500-1000 | 1000 - 2000 | >2000
    'current': String,
    // 项目下一阶段融资需求
    'next' : {
      //融资需求 1-50 | 51-500 | 500-1000 | 1000 - 2000 | >2000
      'need': String,
      //融资回报，出让股份 1-5% | 6% - 10% | 11% - 20% | 21% - 30% | 31% - 40% | 41% - 50% | >50%
      'return': String,
    }
  },
  /**
   * 项目创建者信息
   */
  'creator': {
    //创建者在系统中的id
    'user': {
      'type': Schema.Types.ObjectId,
      'ref': 'User'
    },
    //进入项目时间
    'start_time': Date,
    //在项目中的角色
    'role': String
  }
});

schema.set('toObject', {
  getters: true,
  transform: function (doc, ret, options) {
    ret.creation_time = dateUtil.format(ret.creation_time);
    if (ret.creator && ret.creator.start_time) {
      ret.creator.start_time = dateUtil.format(ret.creator.start_time);
    }
  }
});

/**
 * Constructor to create Project data object
 *
 * @class Project
 *
 */
module.exports = mongoose.model('Project', schema);