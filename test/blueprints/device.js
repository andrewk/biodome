var device = require('../../app/device')
  , DummyDriver = require('./driver');

module.exports = device;

module.exports.make = function() {
  return new device({
    "id"  : "device_" + Math.floor(Math.random() * 100),
    "driver": new DummyDriver
  });
};
