var str = 'foobar';
var encoded = new Buffer(str).toString('base64');
var decoded = new Buffer(encoded, 'base64').toString('utf8');

console.log(str);
console.log(encoded);
console.log(decoded);