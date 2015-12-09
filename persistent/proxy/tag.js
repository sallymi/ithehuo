/**
 * Tag document operation module
 *
 * @module persistent/proxy/tag
 *
 */
 var User = require('../model/user');
 var Tag = require('../model/tag');
 var Q = require('q');
 var logger = require('../../utils/log').getLogger('persistent/proxy/tag.js');
 var mongoose = require('mongoose');


/**
 * Find all tags
 *
 * @function
 * @return {Promise} promise to find all tags:
 * <li> succeed: resolve with tags array
 * <li> failed: reject with error
 *
 */
 exports.findAllTags = function () {
  return Q.Promise(function (resolve, reject) {
    Tag
    .find({'expired':false})
    .sort('-assigned')
    .sort('-ask_count')
    .select('title')
    .exec(function (err, tags) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(tags);
      }
    });
  });
};

/**
 * Find a tag
 *
 * @function
 * @return {Promise} promise to find a tag:
 * <li> found: resolve with the found tag
 * <li> not found: resolve with undefined
 * <li> failed: reject with error
 *
 */
exports.findTag = function (filter) {
  // exclude expired tags
  if (filter) {
    filter.expired = false;
  }
  else {
    filter = {'expired':false};
  }
  return Q.Promise(function (resolve, reject) {
    Tag
      .findOne(filter)
      .exec(function (err, tag) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(tag);
        }
      });
  });
};

/**
 * Find tag by id
 *
 * @function
 * @param {String} tid - tag id
 * @return {Promise} promise to perform a find action:
 * <li>tag found: resolve with tag
 * <li>tag not found: resolve with null
 * <li>error occur during find: reject with error
 *
 */
 exports.findTagById = function (tid) {
  return Q.Promise(function (resolve, reject) {
    Tag
    .findById(tid)
    .exec(function (err, tag) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        if (tag) {
          resolve(tag);
        } else {
          resolve();
        }
      }
    });
  });
};

/**
 * Save tag
 *
 * @function
 * @param {Question} tag - tag to be saved
 * @return {Promise} promise to save the tag:
 * <li>tag saved: resolve with the saved tag
 * <li>error occur during save: reject with error
 *
 */
 exports.saveTag = function (tag) {
  return Q.Promise(function (resolve, reject) {
    var tagToSave = new Tag(tag);
    logger.info('start save tag');
    tagToSave.save(function (err, tag) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve({'_id':tag._id, 'title':tag.title});
      }
    });
  });
};

exports.updateTag = function (tid, title) {
  return Q.Promise(function (resolve, reject) {
   Tag
   .update(
    {"_id": tid },
    {
      "$set": {"title": title}
    })
   .exec(function(err, updated){
    if(err){
      reject(err);
    }else{
      resolve({"effected": updated});
    }
  });
 });
};

/**
* user click tag
*/
exports.clickTag = function (tid) {
  return Q.Promise(function (resolve, reject) {
    Tag
    .update({"_id": tid},
      {"$inc": {"click_count": 1}})
    .exec(function(err, updated){
      if(err){
        reject(err);
      }
      if(updated) {
        resolve({"effected": updated});
      }
    });
  });
};

/**
* user ask question with tag
*/
exports.askTag = function (tid) {
  return Q.Promise(function (resolve, reject) {
    Tag
    .update({"_id": tid},
      {"$inc": {"ask_count": 1}})
    .exec(function(err, updated){
      if(err){
        reject(err);
      }
      if(updated) {
        resolve({"effected": updated});
      };
    });
  });
};

/**
* user fav question with tag
*/
exports.favTag = function (uid, tid, title) {
  return Q.Promise(function (resolve, reject) {
    var tag = {"tag_id": tid, "tag_title": title};
    var ids = [tid];
    User
    .update({"_id": uid, "fav_tags.tag_id": {"$nin": ids} },
      {"$addToSet": { "fav_tags": tag}})
    .exec(function(err, updated){
      if(err){
        reject(err);
      }
      if(updated) {
        Tag.update({"_id": tid},
          {"$inc": {"fav_count": 1}},
          function(err, updated){
            if(err){
              reject(err);
            }else{
              resolve({"effected": updated});
            }
          });
      }else{
        resolve({"effected": 0});
      }
    });
  });
};
