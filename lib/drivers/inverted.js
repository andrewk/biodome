// Inverted boolean driver, flips 1 and 0
// Used to drive relay circuits which use HIGH for OFF
// and LOW for ON (eg: Futurlec relay boards)

var Promise = require('bluebird');

function InvertingDriver(io) {
  this.io = io;
}

InvertingDriver.prototype.read = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.io.read().then(function(value) {
      if (value === 1) {
        resolve(0);
      } else if (value === 0) {
        resolve(1);
      } else {
        reject('IO returned non-boolean value');
      }
    });
  });
};

InvertingDriver.prototype.write = function(endpoint) {
  return this.io.write(endpoint.value === 0 ? 1 : 0);
}

module.exports = InvertingDriver;
module.exports.new = function(io) {
  return new InvertingDriver(io);
};
