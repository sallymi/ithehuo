var chaiAsPromised = require("chai-as-promised");
var chai = require("chai").use(chaiAsPromised);
var mailer = require('../../utils/mail');

chai.should();

describe('util/mail', function () {
  this.timeout(10000);
  describe('#sendActiveMail', function () {
    // it('should send a mail', function () {
    //   var email = 'service_ithhr@126.com';
    //   var subject = 'test subject';
    //   var htmlBody = '<p>test body</p>';
    //   return mailer.sendMail(email, subject, htmlBody).should.be.fulfilled;
    // });

    it('should send an active mail', function () {
      var email = 'service_ithhr@126.com';
      return mailer.sendActiveMail(email).should.be.fulfilled;
    });
  });
});