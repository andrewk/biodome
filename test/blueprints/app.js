var appClass = require('../../lib/app.js')
  , device = require('./device')
  , sensor = require('./sensor')

module.exports = appClass;
module.exports.make = function() {
  var app = appClass.factory();

  app.addDevice(device.make());
  app.addDevice(device.make());
  app.addSensor(sensor.make());
  app.addSensor(sensor.make());

  return app;
}
