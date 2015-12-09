var logger = require('../../utils/log').getLogger('test.js');

function sampleFunction() {
  logger.info('test');
  console.log('inside function');
  console.dir(arguments.callee);
  console.log(arguments.caller);
}

sampleFunction();