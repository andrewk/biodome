// load all the things

require('fs').readdirSync(__dirname + '/lib/').forEach(function(file) {
  if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./lib/' + file).factory;
  }
});

exports.io = {};
require('fs').readdirSync(__dirname + '/lib/io/').forEach(function(file) {
  if (file.match(/.+\.js/g) !== null) {
    var name = file.replace('.js', '');
    exports.io[name] = require('./lib/io/' + file).factory;
  }
});
