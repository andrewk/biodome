var owjs = require('owjs');

require('envc')();

var OwserverIO = function(deviceAddress) {
  var self = this;
  self.deviceAddress = deviceAddress;
  self.client = new owjs.Client({host: process.env.ONEWIRESERVER});

  this.read = function(callback) {
    self.client.read(self.deviceAddress, function(err, result) {
      callback(err, result);
    });
  };

  this.write = function(value, callback) {
    self.client.write(self.deviceAddress, value, function(err, result) {
      callback(err, result);
    });
  }
};

module.exports = OwserverIO;
module.exports.factory = function(deviceAddress) {
  return new OwserverIO(deviceAddress);
};

