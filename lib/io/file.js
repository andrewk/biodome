var fs = require('graceful-fs');
var Promise = require('bluebird');

var FileIO = function(path) {
  this.read = function() {
    return new Promise(function(resolve, reject) {
      fs.readFile(path, { 'encoding': 'utf-8'}, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  this.write = function(value) {
    return new Promise(function(resolve, reject) {
      fs.writeFile(path, value, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  };
};

module.exports = FileIO;
module.exports.new = function(path) {
  return new FileIO(path);
};

