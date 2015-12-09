var mailer = require("nodemailer");
var mailerConfig = require('../../config').mailer;

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = mailer.createTransport('SMTP', mailerConfig);

// setup e-mail data with unicode symbols
var mailOptions = {
  from: "service_ithhr@126.com", // sender address
  to: "service_ithhr@126.com", // list of receivers
  subject: "Hello ✔", // Subject line
  text: "Hello world ✔", // plaintext body
  html: "<b>Hello world ✔</b>" // html body
};

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function (error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log("Message sent: " + response.message);
  }
  smtpTransport.close(); // shut down the connection pool, no more messages
});