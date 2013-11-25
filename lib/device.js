var Submachine = require("submachine").Submachine;

var Device = Submachine.subclass(function(proto) {
  this.hasStates("init", "on", "off", "error");

  proto.is = function(state) {
    return this.state == state;
  };

  proto.initialize = function(gpio) {
    this.gpio = gpio;
    if (this.gpio.direction == "in") this.gpio.setDirection("out");
    this.initState("init");
  };
});

module.exports = Device;
