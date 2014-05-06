var device = require('../../lib/device')
  , driver = require('../../lib/drivers/base')
  , io = require('../mocks/io').new();

module.exports = device;

module.exports.make = function() {
  return new device({
    "id"  : "device_" + Math.floor(Math.random() * 100),
    "driver": new driver(io)
  });
};
