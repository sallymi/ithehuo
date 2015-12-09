var chaiAsPromised = require("chai-as-promised");
var chai = require("chai").use(chaiAsPromised);
var connection = require('../../../persistent/connection');
var userProxy = require('../../../persistent/proxy/user');
var User = require('../../../persistent/model/user');

chai.should();

var email = 'zhangsan@gmail.com';
var password = 'password';

describe('persistent/proxy/user', function () {
  before(function () {
    return connection.connect();
  });

  it('should create a user and return a fulfilled promise', function () {
    return userProxy.createUser(email, password).should.be.fulfilled;
  });

  it('should find the user and return a fulfilled promise', function () {
    return userProxy.findUserByEmail(email).should.be.fulfilled.then(function (user) {
      console.log(user);
    });
  });

  it('should return a fulfilled promise and resovle with null', function () {
    return userProxy.findUserByEmail('nouser@test.com').should.eventually.equal(null);
  });

  after(function () {
    User.remove({'email': email});
    return connection.disconnect();
  });
});