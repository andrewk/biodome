var appClass = require('../../lib/app.js')
  , conf = require('../../config/app')
  , device = require('./device')
  , sensor = require('./sensor')

module.exports = appClass;
module.exports.make = function() {
  var app = new appClass(conf);

  app.addDevice(device.make());
  app.addDevice(device.make());
  app.addSensor(sensor.make());
  app.addSensor(sensor.make());

  return app;
}
