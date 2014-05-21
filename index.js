// load all the things to provide Biodome convenience loader

var fs = require('fs');

fs.readdirSync(__dirname + '/lib/').forEach(function(file) {
  if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./lib/' + file).new;
  }
});

exports.drivers = importDir('/lib/drivers/');
exports.io = importDir('/lib/io/');

function importDir(dir) {
  var obj = {};
  fs.readdirSync(__dirname + dir).forEach(function(file) {
    if (file.match(/.+\.js/g) !== null) {
      var name = file.replace('.js', '');
      obj[name] = require('.' + dir + file).new;
    }
  });
  return obj;
}
