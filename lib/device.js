var Endpoint = require('./endpoint')
  , util = require('util')
  , Promise = require("bluebird");

function Device(params) {
  params.type = 'device';
  Endpoint.call(this, params);
};

util.inherits(Device, Endpoint);

Device.prototype.switch = function(state) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (['on', 'off'].indexOf(state.toLowerCase()) === -1) {
      reject('Device#switch only accepts ON or OFF'); 
    } else {
      return self.write(state.toLowerCase() === 'on' ? 1 : 0);
    }
  });
};

module.exports = Device;
module.exports.new = function(opts) {
  return new Device(opts);
};
