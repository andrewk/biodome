var Endpoint = require('./endpoint')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter;

function Device(opts) {
  EventEmitter.call(this);
  this.id = opts.id;
  this.driver = opts.driver;
};

util.inherits(Device, Endpoint);

Device.prototype.on = function(next) {
  this.switch("on", next);
};

Device.prototype.off = function(next) {
  this.switch("off", next);
};

Device.prototype.switch = function(state, next) {
  if (state == this.state) return;
  if (["on", "off"].indexOf(state) == -1) return;
  this.value = (state == "on") ? 1 : 0,
  this.driver.toHardware(this, next);
};

module.exports = Device;
