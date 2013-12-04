var appClass = require('../../app/app.js')
  , conf = require('../../config/app')
  , device = require('./device')
  , sensor = require('./sensor')

module.exports = appClass;
module.exports.make = function() {
  var app = new appClass(conf);

  app.devices.push(device.make());
  app.devices.push(device.make());
  app.sensors.push(sensor.make());
  app.sensors.push(sensor.make());

  return app;
}
