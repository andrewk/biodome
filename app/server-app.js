var ServerApp = function(nconf) {
  var self = this;

  self.conf = nconf;
  self.devices = [];

  self.gpio = (self.conf.get('NODE_ENV') == 'production') ?
    require('gpio') : require('../test/mocks/gpio.js');

};

module.exports = ServerApp;
