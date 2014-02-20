var Endpoint = require('./endpoint')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter;

function Device(opts) {
  Endpoint.call(this, 'device');
  this.id = opts.id;
  this.driver = opts.driver;
};

util.inherits(Device, Endpoint);

Device.prototype.switch = function(state, next) {
  if (state == this.state) return;
  if (["on", "off"].indexOf(state) == -1) return;
  this.value = (state == "on") ? 1 : 0,
  this.setState(state);
  this.driver.toHardware(this, next);
};

module.exports = Device;
module.exports.factory = function(opts) {
  return new Device(opts);
};
