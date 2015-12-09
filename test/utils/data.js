var connection = require('../../persistent/connection');
var userProxy = require('../../persistent/proxy/user');
var projectProxy = require('../../persistent/proxy/project');
var mongoose = require('mongoose');

// connection.connect().then(function () {
//   return userProxy.findUsers({
//     age: {
//       '$gt': '10'
//     }
//   });
// }).then(function (users) {

//   console.log(users);

//   // var user = users[1];
//   // console.dir(user.toObject());
//   // console.log(user.populate);
//   // console.log("================");
//   // console.dir(user.toObject());
//   connection.disconnect();
// });


// connection.connect().then(function () {
//   return projectProxy.findProjects({
//     'funding.current' : '50-100万'
//   });
// }).then(function (projects) {
//   console.log(projects);
//   connection.disconnect();
// });

var a1 = [1,2,3];
var a2 = [4,5,6];
console.log(a1.concat(a2));