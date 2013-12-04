var driver = require('./driver')
  , sensor = require('../../app/sensor');

module.exports = sensor;

module.exports.make = function() {
  return new sensor({
    "id" : "sensor_" + Math.floor(Math.random() * 100),
    "driver" : driver.make()
  });
};
