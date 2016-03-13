/**
 * Handle general requests
 *
 * @module biz/index
 *
 */
var Q = require('q');
var messageProxy = require('../persistent/proxy/message.js');
var projectProxy = require('../persistent/proxy/project.js');
var resUtil = require('../utils/response');
var reqUtil = require('../utils/request');
var logger = require('../utils/log').getLogger('biz/index.js');

/**
 * Request handler for index page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.index = function (req, res) {
  logger.info('request received for index page');
  logger.info('try to find all hot projects');
  Q.all([
    projectProxy.findHotProjects(),
    projectProxy.findRecommendedProjects()
  ]).then(function (result) {
    logger.info(result);
    resUtil.render(req, res, 'index', {
      title: 'IT合伙人',
      hots: result[0],
      recommends : result[1]
    });
  }).fail(function (err) {
    logger.error(err);
    res.render('error');
  });
};

/**
 * Request handler for user home - user profile page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
exports.userHome = function (req, res) {
  if(reqUtil.getUserEmail(req)&&reqUtil.getUserMobile(req)){
    //already set email and phone
    resUtil.render(req, res, 'user_home_profile', {
      title: '我的IT合伙人',
    });
  }
  else if(reqUtil.getUserEmail(req)){
    //regester by email or already set email from setting page
    logger.info('request received to user home - user profile page, requester email: ' + reqUtil.getUserEmail(req));
    logger.info('will render user_home_profile page with the user in session');
    resUtil.render(req, res, 'user_home_profile', {
      regesterByEmail: true,
      title: '我的IT合伙人',
    });

  }else if(reqUtil.getUserMobile(req)){
    logger.info('request received to user home - user profile page, requester phone: ' + reqUtil.getUserMobile(req));
    logger.info('will render user_home_profile page with the user in session');
    resUtil.render(req, res, 'user_home_profile', {
      regesterByPhoneNum: true,
      title: '我的IT合伙人',
    });
    
  }
  
};

// 这是什么神奇的存在！ 完全不应该出现在这个地方啊
// 地址的自动补全函数
exports.getAddress = function (req, res) {
  var city = require('../config').city;
  logger.debug('request received to address list page');
  logger.debug('try to find all address in db');
  res.json(city);
};

// user profile 的领域方向自动补全函数
exports.getSuggestFiled = function (req, res) {
  var term = req.query.term;
  var filed = require('../config').filed;
  var result=filed.filter(function(fd){
    return fd.alias.indexOf(term)!=-1;
  })
  if(term)
    res.json(result);
  else
    res.json(filed);
}

exports.validateCity = function (req, res) {
  var city = req.body.city;
  var cities = require('../config').city;
  var result=cities.some(function(ct){
    return ct.value==city;
  })
  res.json(result);
}
exports.getProvince = function (req, res) {
  var city = require('../config').province;
  logger.debug('request received to province list page');
  logger.debug('try to find all province in db');
  res.json(city);
};

exports.validateProvince = function (req, res) {
  var prov = req.body.province;
  var provinces = require('../config').province;
  var result=provinces.some(function(ct){
    return ct.value==prov;
  })
  res.json(result);
}

exports.construct = function (req, res) {
  res.render('under_construction');
}