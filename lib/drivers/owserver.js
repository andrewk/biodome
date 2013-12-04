var owjs = require('owjs')
  , conf = require('../../config/app')
  , base = require('./base');

var OwserverDriver = function(deviceAddress) {
  var self = this;
  self.deviceAddress = deviceAddress;
  self.client = new owjs.Client({host: conf.get('owserver_ip')});

  this.read = function(callback) {
    self.client.read(self.deviceAddress, function(err, result) {
      self.value = result;
      callback(err);
    });
  }
};

OwserverDriver.prototype = new base;

module.exports = OwserverDriver;

