var fs = require('fs')
  , nconf = require('nconf')
  , device = require('./device.js');

// setup config
nconf.argv()
     .env();

nconf.defaults({
  'NODE_ENV' : "development"
});

var App = function() {
  var self = this;

  self.devices = [];

  self.gpio = (nconf.get('NODE_ENV') == 'production') ?
    require('gpio') : require('../test/mocks/gpio');

  self.devices.push(new device(self.gpio.export(1), "switch"));

};

module.exports = App;
