var conf = require('../../config/app')
  , biodome = require('../../app/app')
  , device = require('../../app/device')

var fixtureApp = function(opts) {
  var app = new biodome(conf);
  app.devices = [
    new device(app.gpio.export(1), "switch"),
    new device(app.gpio.export(2), "pump")
  ];

  return app;
};

module.exports = fixtureApp();
