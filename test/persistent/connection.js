var chaiAsPromised = require("chai-as-promised");
var chai = require("chai").use(chaiAsPromised);
var connection = require('../../persistent/connection.js');

chai.should();

describe('persistent/connection', function () {
  describe('#connect', function () {
    it('should connected to mongo db and return a fulfilled promise', function () {
      return connection.connect().should.be.fulfilled;
    });
  });

  describe('#disconnect', function () {
    it('should close all the connections and return a fulfilled promise', function () {
      return connection.disconnect().should.be.fulfilled;
    });
  });
});