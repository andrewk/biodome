var Promise = require('bluebird');

var MockIO = function(alwaysSucceed) {
  this.lastWrite = -1;
  this.alwaysResolve = alwaysSucceed;

  this.read = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.alwaysResolve ? resolve(self.lastWrite) : reject('Error');
    });
  };

  this.write = function(value) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.lastWrite = value;
      self.alwaysResolve ? resolve(value) : reject('Error');
    });
  };
};

module.exports = MockIO
module.exports.new = function(alwaysSucceed) {
  return new MockIO(alwaysSucceed);
};

