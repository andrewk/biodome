var Submachine = require("submachine").Submachine
  , EventEmitter = require('events').EventEmitter

var Device = Submachine.subclass(function(proto) {
  this.hasStates("on", "off", "error", "busy", "ready");
  this.transition({ from: "*",  to: "off", on: "off" });
  this.transition({ from: "*", to: "on",  on: "on" });
  this.transition({ from: "*", to: "error",  on: "throwError" });
  this.transition({ from: "*", to: "busy", on: "markBusy"});
  this.transition({ from: "busy",  to: "ready", on: "driverUpdated" });

  this.onEnter("*", function() {
    this.events.emit(this.state, this.toJSON());
    this.events.emit('update', this.toJSON());
  });

  this.onEnter("off", function() {
  });

  this.onEnter("on", function() {
  });

  proto.is = function(state) {
    return this.state == state;
  };

  proto.toJSON = function() {
    return {
      "type" : "device",
      "id"   : this.id,
      "createdAt" : this.createdAt,
      "state" : this.state
    };
  };

  proto.switch = function(state, callback) {
    var self = this;
    if (state == this.state) return;
    if (["on", "off"].indexOf(state) == -1) return;

    this.driver.send(
      state == "on" ? 1 : 0,
      this,
      function switchCallback(err) {
        if(state == "on") self.on();
        if(state == "off") self.off();
        if("function" == typeof callback) callback(err);
      }
    );
  };

  proto.inheritStateFromDriver = function(callback) {
    var self = this;
    this.driver.read(function() {
      self.driver.value == 1 ? self.switch("on") : self.switch("off");
      if("function" == typeof callback) callback(null, self);
    });
  };

  proto.initialize = function(opts) {
    this.id = opts.id;
    this.driver = opts.driver;
    this.events = new EventEmitter;
    this.createdAt = Math.round(Date.now() / 1000);
    this.initState("ready");
  };
});

module.exports = Device;
