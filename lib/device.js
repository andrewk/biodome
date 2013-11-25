var Submachine = require("submachine").Submachine;

var Device = Submachine.subclass(function(proto) {
  this.hasStates("init", "on", "off", "error");

  proto.is = function(state) {
    return this.state == state;
  };

  proto.initialize = function() {
    this.initState("init");
  };
});

module.exports = Device;
