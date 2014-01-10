var driver = require('../../app/driver')
  , sensor = require('../../app/sensor')
  , io = require('./io').make()

module.exports = sensor;

module.exports.make = function() {
  return new sensor({
    "id" : "sensor_" + Math.floor(Math.random() * 100),
    "driver" : new driver(io)
  });
};
