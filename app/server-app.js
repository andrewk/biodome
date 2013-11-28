var lo = require('lodash');

var ServerApp = function(nconf) {
  var self = this;

  // Setup
  self.conf = nconf;
  self.devices = [];

  self.gpio = (self.conf.get('NODE_ENV') == 'production') ?
    require('gpio') : require('../test/mocks/gpio.js');

  // Device finder
  self.device = function(id) {
    var dvs = lo.where(self.devices, {'id' : id });
    return (dvs.length == 0) ? null : dvs[0];
  };
};

module.exports = ServerApp;
