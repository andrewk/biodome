var EventEmitter = require('events').EventEmitter
  , Stateful = require('./stateful');

var Device = function(opts) {
  var self = this;
  this.id = opts.id;
  this.driver = opts.driver;
  this.events = new EventEmitter;
  this.createdAt = Math.round(Date.now() / 1000);
  this.state = "init";

  this.isState = function(state) {
    return this.state == state;
  };

  this.toJSON = function() {
    return {
      "type" : "device",
      "id"   : this.id,
      "createdAt" : this.createdAt,
      "state" : this.state
    };
  };

  this.driverUpdated = function() {
    this.setState("ready");
  };

  this.on = function() {
    this.switch("on");
  };
  
  this.stateChanged = function() {
    this.events.emit(this.state, this.toJSON());
    this.events.emit("update", this.toJSON());
  };

  this.off = function() {
    this.switch("off");
  };

  this.switch = function(state, callback) {
    if (state == this.state) return;
    if (["on", "off"].indexOf(state) == -1) return;

    this.driver.send(
      state == "on" ? 1 : 0,
      this,
      function switchCallback(err) {
        self.setState(state);
        if("function" == typeof callback) callback(err);
      }
    );
  };

  this.inheritStateFromDriver = function(callback) {
    this.driver.read(function() {
      self.driver.value == 1 ? self.switch("on") : self.switch("off");
      if("function" == typeof callback) callback(null, self);
    });
  };
};

Device.prototype = new Stateful;

module.exports = Device;
