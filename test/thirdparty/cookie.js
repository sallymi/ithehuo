var cookie = require('cookie');

var user = {
  'name': 'hello',
  'password': 'world'
};

console.log(user);
console.log(cookie.serialize('name', user.name));
console.log(cookie.serialize('password', user.password));