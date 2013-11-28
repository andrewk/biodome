var conf = require('../../config/app.js')
  , serverApp = require('../../app/server-app')
  , device = require('../../app/device')

var fixtureApp = function(opts) {
  var app = new serverApp(conf);
  app.devices = [
    new device(app.gpio.export(1), "switch"),
    new device(app.gpio.export(2), "pump")
  ];

  return app;
};

module.exports = fixtureApp();
