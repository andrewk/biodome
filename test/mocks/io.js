var Promise = require('bluebird');

var MockIO = function(alwaysSucceed) {
  this.lastWrite = -1;

  this.read = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      alwaysSucceed ? resolve(self.lastWrite) : reject('Error');
    });
  };

  this.write = function(value) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.lastWrite = value;
      alwaysSucceed ? resolve() : reject('Error');
    });
  };
};

module.exports = MockIO
module.exports.new = function(alwaysSucceed) {
  return new MockIO(alwaysSucceed);
};

