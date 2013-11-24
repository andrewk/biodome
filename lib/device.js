var Submachine = require("submachine").Submachine;

var Device = Submachine.subclass(function(proto) {
  this.hasStates("init", "on", "off", "error");

  this.is = function(state) {
    return this.state == state;
  };

  proto.initialize = function() {
    this.initState("init");
  };
});

module.exports = function() { return Device };
