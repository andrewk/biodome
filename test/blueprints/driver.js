var Base = require('../../lib/drivers/base')

var DummyDriver = function() {
  this.read = function(callback) {
    error = null;
    this.value = Math.floor(Math.random() * 100);
    callback(error);
  }
};

DummyDriver.prototype = new Base;

module.exports = DummyDriver;
module.exports.make = function() { return new DummyDriver() };
