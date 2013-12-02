var conf = require('../../config/app')
  , biodome = require('../../app/app')
  , device = require('../../app/device')
  , sensor = require('../../app/sensor')

var fixtureApp = function(opts) {
  var app = new biodome(conf);
  app.devices = [
    new device(app.gpio.export(1), "switch"),
    new device(app.gpio.export(2), "pump")
  ];

  app.sensors = [
    new sensor({"id":"water-temp"}),
    new sensor({"id":"air-temp"})
  ];

  return app;
};

module.exports = fixtureApp();
