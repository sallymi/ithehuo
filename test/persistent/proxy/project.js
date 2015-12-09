var connection = require('../../../persistent/connection');
var projectProxy = require('../../../persistent/proxy/project');

describe('persistent/proxy/project', function () {
  before(function () {
    return connection.connect();
  });

  it('should create a project', function () {
    return projectProxy.createProject({}).then(function (err) {
      console.log(err);
    });
  });
});