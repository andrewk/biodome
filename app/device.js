var Submachine = require("submachine").Submachine
  , EventEmitter = require('events').EventEmitter

var Device = Submachine.subclass(function(proto) {
  this.hasStates("on", "off", "error");
  this.transition({ from: "on",  to: "off", on: "off" });
  this.transition({ from: "off", to: "on",  on: "on" });
  this.transition({ from: "*", to: "error",  on: "throwError" });

  this.onEnter("*", function() {
    this.events.emit(this.state, this.toJSON());
    this.events.emit('update', this.toJSON());
  });

  this.onEnter("off", function() {
    this.gpio.set(0);
  });

  this.onEnter("on", function() {
    this.gpio.set(1);
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

  proto.switch = function(state) {
    if (state == this.state) return;
    if (["on", "off"].indexOf(state) == -1) return;

    if(state == "on") this.on();
    if(state == "off") this.off();
  };

  proto.initialize = function(opts) {
    this.id = opts.id;
    this.events = new EventEmitter;
    this.gpio = opts.gpio;
    if (this.gpio.direction == "in") this.gpio.setDirection("out");
    this.createdAt = Math.round(Date.now() / 1000);
    this.initState("off");
  };
});

module.exports = Device;
