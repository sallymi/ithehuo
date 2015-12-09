var filterUtil = require('../../utils/filter');

var query = {
  location: '北京',
  tag: '互联网',
  age$gt : 30
};

console.log(query);
console.log("=================");
console.log(filterUtil.toMongoFilter(query));