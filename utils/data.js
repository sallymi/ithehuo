/**
 * Provide toObject for mongoose documents object
 *
 * @module utils/data
 *
 */
var mongoose = require('mongoose');

exports.toObject = function (doc) {
  var type = typeof doc;
  if (type === 'array') {
    var i;
    for (i = 0; i < doc.length; i++) {
      if (doc[i] instanceof mongoose.Document) {
        doc[i] = doc[i].toObject();
      }
    }
  } else {
    if (doc  instanceof mongoose.Document) {
      doc = doc.toObject();
    }
  }
  return doc;
};