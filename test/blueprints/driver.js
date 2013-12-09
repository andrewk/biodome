var Base = require('../../lib/drivers/base')

var DummyDriver = function() {
  this.read = function(callback) {
    this.value = Math.floor(Math.random() * 100);
    callback(null);
  }

  this.write = function(value, callback) {
    this.value = value;
    callback(null);
  }
};

DummyDriver.prototype = new Base;

module.exports = DummyDriver;
module.exports.make = function() { return new DummyDriver() };
