var owjs = require('owjs');
var Promise = require('bluebird');

require('envc')();

var OwserverIO = function(deviceAddress) {
  var self = this;
  self.deviceAddress = deviceAddress;
  self.client = new owjs.Client({host: process.env.ONEWIRESERVER});

  this.read = function() {
    return new Promise(function(resolve, reject) {
      self.client.read(self.deviceAddress, function(err, result) {
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
      self.client.write(self.deviceAddress, value, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

/*
  this.read = function(callback) {
    self.client.read(self.deviceAddress, function(err, result) {
      callback(err, result);
    });
  };

[<32;0;35M  this.write = function(value, callback) {
    self.client.write(self.deviceAddress, value, function(err, result) {
      callback(err, result);
    });
  };
*/
};

module.exports = OwserverIO;
module.exports.new = function(deviceAddress) {
  return new OwserverIO(deviceAddress);
};

