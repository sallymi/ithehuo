var Q = require('q');

function getNumber() {
  return 10;
}

Q.fcall(getNumber).then(function (number) {
  console.log(number);
})

Q(5).then(function (p) {
  console.log(p);
});