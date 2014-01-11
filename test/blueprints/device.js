var device = require('../../lib/device')
  , driver = require('../../lib/driver')
  , io = require('./io').make();

module.exports = device;

module.exports.make = function() {
  return new device({
    "id"  : "device_" + Math.floor(Math.random() * 100),
    "driver": new driver(io)
  });
};
