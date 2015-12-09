/**
 * Define recruitment schema
 *
 * @module persistent/model/recruitment
 *
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
  /**
   * 招募状态
   * open: 公开招募，对所有人可见，默认值
   * archived: 招募已归档，只对创建者可见
   * delete: 招募已经被创建者删除
   */
  'status': {
    'type': String,
    'default': 'open'
  },
  /**
   * 创建时间，招募创建时自动添加系统时间
   */
  'creation_time': {
    'type': Date,
    'default': Date.now
  },
  /**
   * 创建者id
   */
  'creator': {
    'type': Schema.Types.ObjectId,
    'ref': 'User'
  },
  /**
   * 招募的项目id
   */
  'project': {
    'type': Schema.Types.ObjectId,
    'ref': 'Project'
  },
  /**
   * 合伙人类型
   * 创始人 | 技术合伙人 | 产品设计合伙人 | 市场营销合伙人 | 运营合伙人 | 资源合伙人 | 资金合伙人
   */
  'classify': String,
  /**
   * 工作性质
   * 全职 | 兼职 | 双方商议
   */
  'work_nature': String,
  /**
   * 薪资范围，单位：k
   * 包含最小值和最大值两个字段
   */
  'payment_min': Number,
  'payment_max': Number,
  /**
   * 期权范围，单位：%
   * 包含最小值和最大值两个字段
   */
  'share_option_min': Number,
  'share_option_max': Number,
  /**
   * 工作所在城市
   */
  'location': String,
  /**
   * 工作详细地址
   */
  'address': String,
  /**
   * 工作年限要求
   */
  'years_of_working': String,
  /**
   * 学历要求
   */
  'education_background': String,
  /**
   * 年龄要求
   */
  'age': String,
  /**
   * 一句话描述亮点，例如 明星互联网项目，有期权
   */
  'keyword': String,
  /**
   * 希望应聘者的籍贯（老乡）
   */
  'hometown': String,
  /**
   * 希望应聘者的毕业院校 （想找校友吗）
   */
  'school': String,
  /**
   * 希望应聘者的心态，期望全职主导创业 | 期望全职参与创业 | 希望兼职参与创业
   */
  'attitude': String,
  /**
   * 职位描述
   */
  'description': String,
  /**
   * 接收简历邮箱
   */
  'hr_email': String
});

/**
 * Constructor to create Recruitment data object
 *
 * @constructor Recruitment
 *
 */
module.exports = mongoose.model('Recruitment', schema);