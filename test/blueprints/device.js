var device = require('../../app/device')
  , gpio = require('../mocks/gpio');

module.exports = device;

module.exports.make = function() {
  return new device({
    "id"  : "device_" + Math.floor(Math.random() * 100),
    "gpio": gpio.export(1)
  });
};
