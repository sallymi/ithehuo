/**
 * Provide filter format rest to mongo filter
 *
 * @module utils/filter
 *
 * There are 3 forms of query:
 * 1. HTTP querystring where keys are the attributes of the raobject and item.
 *    Example, GET /cars?make=bmw&color=red
 * 2. Enhanced querystring with a subset of MongoDB query operators:
 *    $gt (greater than), $gte (greater than or equal), $lt (less
 *    than), $lte (less than or equal), $ne (not equal).
 *    Example, GET /cars?make=bmw&year$gt=2010
 * 3. Advanced querystring of the form ?$filter=MongoDB query.
 *    Example, GET /cars?$filter={"$or":[{"make":"bmw"},{"year":2014}]}
 *
 * In Alpha, only the 1 and 2 are implemented.
 */
exports.toMongoFilter = function (query) {

  // Specify AND Conditions
  var queryKey, queryValue;
  var mongoKey, mongoOperator, mongoValue, mongoCondition;
  var mongoFilter = {};
  var temp;
  for (queryKey in query) {
    queryValue = query[queryKey];

    if (queryKey.indexOf('$') > 0) {
      // Specify Conditions Using Query Operators
      temp = queryKey.split('$');

      mongoKey = temp[0];
      mongoOperator = '$' + temp[1];
      mongoValue = queryValue;

      if (mongoFilter[mongoKey]) {
        // assemble conditions for same mongo key
        mongoCondition = mongoFilter[mongoKey];
      } else {
        mongoCondition = {};
      }

      mongoCondition[mongoOperator] = mongoValue;
      mongoFilter[mongoKey] = mongoCondition;
    } else {
      // Specify Equality Condition
      mongoFilter[queryKey] = query[queryKey];
    }
  }
  return mongoFilter;
};

/**
 * check if the query is a project related recruiments filter
 *
 * @function
 * @param query - query for recruitments
 * return project filter if query is a project filter | null if query is not project related filter
 */
exports.toProjectFilter = function (query) {
  var keys = Object.keys(query);

  // should no be a project filter if no query is provided
  if (keys.length < 1) {
    return false;
  }

  // only single project filter is supported
  if (keys.length > 1) {
    return false;
  }

  var key = keys[0];
  if (key.indexOf('project.') !== -1) {
    var k = key.split('.')[1];
    var v = query[key];
    var filter = {};
    filter[k] = v;

    return filter;
  }

  return false;
};