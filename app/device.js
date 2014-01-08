var EventEmitter = require('events').EventEmitter
  , Stateful = require('./stateful');

var Device = function(opts) {
  this.id = opts.id;
  this.driver = opts.driver;

  this.on = function() {
    this.switch("on");
  };
  
  this.off = function() {
    this.switch("off");
  };

  this.switch = function(state, callback) {
    if (state == this.state) return;
    if (["on", "off"].indexOf(state) == -1) return;
    this.value = (state == "on") ? 1 : 0,   
    this.driver.toHardware(this);
  };
};

util.inherit(Device, Endpoint);
module.exports = Device;
