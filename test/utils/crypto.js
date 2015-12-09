var chaiAsPromised = require("chai-as-promised");
var chai = require("chai").use(chaiAsPromised);
var crypto = require('../../utils/crypto');

chai.should();

describe('util/crypto', function () {
  describe('#md5', function () {
    it('should create a md5 hash', function () {
      var str = 'foobar';
      var str_hash = '3858F62230AC3C915F300C664312C63F';
      var hash = crypto.md5(str);
      hash.toLowerCase().should.equal(str_hash.toLowerCase());
    });
  });
  describe('#base64Encode', function () {
    it('should encode a string to base64', function () {
      var str = 'foobar';
      var str_base64 = 'Zm9vYmFy';
      crypto.base64Encode(str).should.equal(str_base64);
    });
  });
  describe('#base64Decode', function () {
    it('should decode a base64 string to utf8', function () {
      var str = 'foobar';
      var str_base64 = 'Zm9vYmFy';
      crypto.base64Decode(str_base64).should.equal(str);
    });
  });
  describe('#encrypt', function () {
    it('should encrypt a string', function () {
      var str = 'foobar';
      var str_enctypted = 'afcce6de7cab68c0835560787f6ca2c1';
      crypto.encrypt(str).should.equal(str_enctypted);
    });
  });
  describe('#decrypt', function () {
    it('should decrypt a string', function () {
      var str = 'foobar';
      var str_enctypted = 'afcce6de7cab68c0835560787f6ca2c1';
      crypto.decrypt(str_enctypted).should.equal(str);
    });
  });
});