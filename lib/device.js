var Endpoint = require('./endpoint')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter;

function Device(opts) {
  Endpoint.call(this);
  this.id = opts.id;
  this.driver = opts.driver;
  this.wireEvents();
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
  this.setState(state);
  this.driver.toHardware(this, next);
};

Device.prototype.wireEvents = function() {

}

module.exports = Device;
module.exports.factory = function(opts) {
  return new Device(opts);
};
