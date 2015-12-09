/**
 * Handle tags related requests
 *
 * @module biz/tags
 *
 */
 var tagProxy = require('../persistent/proxy/tag');
 var userProxy = require('../persistent/proxy/user');
 var reqUtil = require('../utils/request');
 var resUtil = require('../utils/response');
 var logger = require('../utils/log').getLogger('biz/tag.js');

/**
 * Request handler for tag list page
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
 exports.getTags = function (req, res) {
  logger.debug('request received to tags list page');
  logger.debug('try to find all tags in db');
  var uid = reqUtil.getUserId(req);
  tagProxy.findAllTags().then(function (tags) {
    logger.debug('bellow tags found');
    var result = new Array();
    tags.map(function(item){
      result.push(item.title);
    });
    res.json(result);
  }).fail(function (err) {
    logger.error('failed to find all tags due to bellow error, will response error page with the error');
    logger.error(err);
    resUtil.render(req, res, 'error', err);
    //res.status(500).json(err);
  });
};

/**
 * Request handler to get a tag
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
 exports.getTag = function (req, res) {
  logger.debug('request to tag detail page');
  var tid = req.params.tid;
  var uid = reqUtil.getUserId(req);
  logger.debug('try to find tag by id, tid: ' + tid);
  tagProxy.findTagById(tid).then(function (tag) {
    if (tag) {
      logger.debug('tag found, will render and response tag detail page');
      res.json(tag);
    } else {
      logger.debug('tag not found, will render error page with tag not found error');
      resUtil.render(req, res, 'error', new Error('tag not found'));
      //res.status(500).json({'error': 'tag not found'});
    }
  }).fail(function (err) {
    logger.error('failed to find tag by id due to bellow error, will render error page with the bellow error');
    logger.error(err);
    resUtil.render(req, res, 'error', err);
    //res.status(500).json(err);
  });
};

/**
 * Request handler to create a tag
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
 exports.askTag = function (req, res) {
  logger.debug('request to ask tag page');
  resUtil.render(req, res, 'tags_ask', null);
};

/**
 * Request handler to update a tag
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
 exports.updateTag = function (req, res) {
  logger.debug('request received to update a tag');
  var tid = req.params.tid;
  var title = req.body.title;
  var content = req.body.content;
  logger.debug('bellow is the tag update');
  logger.debug(title);
  logger.debug(content);
  logger.debug('try find tag in db and then update');
  tagProxy.updateQustion(tid, title, content).then(function (u) {
    logger.debug('update tag success');
    res.json(u);
  }).fail(function (err) {
    logger.error('failed to update tag');
    logger.error(err);
    res.json(err);
  });
};

/**
 * Request handler to create a tag
 *
 * @function
 * @param req - express http request
 * @param res - express http response
 *
 */
 exports.createTag = function (req, res) {
  logger.debug('request received to create a tag');
  var tid = req.params.tid;
  var uid = reqUtil.getUserId(req);
  var tagSave = req.body;
  logger.debug('bellow is the tag create');
  tagSave.created_by = uid;
  logger.debug(tagSave);

  logger.debug('try find tag in db and then save');
  tagProxy.saveTag(tagSave).then(function (pro) {
    logger.info('bellow tag created, will response with the tag');
    logger.info(pro);
    res.json(pro);
  }).fail(function (err) {
    logger.error('error occur when try to create tag, will response with the error');
    logger.error(err);
    res.status(500).json(err);
  });
};


/**
* user fav a tag
*/
exports.favTag = function (req, res) {
  var tid = req.params.tid;
  var uid = reqUtil.getUserId(req);
  var title = req.body;
  if(title) title = title.content;
  logger.debug('user add fav tag:' + title);
  logger.debug('user id:' + uid + " tag id: " + tid);
  tagProxy.favTag(uid, tid, title).then(function (pro) {
    logger.info('bellow fav tag finished');
    //logger.info(pro);
    res.json(pro);
  }).fail(function (err) {
    logger.error('error occur when try to fav tag');
    logger.error(err);
    res.status(500).json(err);
  });
};


/**
* get user's fav tags
*/
exports.getFavTags = function (req, res) {
  logger.debug('begin get fav tags of user');
  var uid = req.params.uid;
  tagProxy.getFavTags(uid).then(function (pro) {
    logger.info('find successs');
    logger.info(pro);
    res.json(pro);
  }).fail(function (err) {
    logger.error('error occur when try to find fav qustions');
    logger.error(err);
    res.status(500).json(err);
  });
};