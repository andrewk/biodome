var lo = require('lodash')
  , server = require('./server');

var Biodome = function(nconf) {
  var self = this;
  self.appServer = null;

  // Setup
  self.conf = nconf;
  self.devices = [];

  self.gpio = (self.conf.get('NODE_ENV') == 'production') ?
    require('gpio') : require('../test/mocks/gpio.js');

  // Lazy load server
  self.server = function() {
    if(!self.appServer) {
      self.appServer = server(self);
    }

    return self.appServer;
  };

  // Device finder
  self.device = function(id) {
    var dvs = lo.where(self.devices, {'id' : id });
    return (dvs.length == 0) ? null : dvs[0];
  };
};

module.exports = Biodome;
