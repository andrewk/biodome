var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , Submachine = require("submachine").Submachine;

var Sensor = Submachine.subclass(function(proto) {
  proto.events = new EventEmitter;

  this.hasStates("init", "ready", "busy", "error");
  this.transition({ from: "*", to: "busy", on: "markBusy"});
  this.transition({ from: "busy", to: "ready", on: "markComplete"});

  this.onEnter("*", function() {
    proto.events.emit(this.state);
  });

  this.onEnter("ready", function() {
    this.updatedAt = Math.floor(Date.now());
  });

  proto.initialize = function(opt) {
    this.id = opt.id;
    this.driver = opt.driver;
    this.updatedAt = null;
    this.events = proto.events;
    
    this.initState("init");
    this.update();
  };

  proto.toJSON = function() {
    return {
      "id" : this.id,
      "updatedAt" : this.updatedAt,
      "state" : this.value
    };
  };

  proto.value = function() {
    return this.driver.value;
  };

  proto.update = function(callback) {
    this.markBusy();
    this.driver.updateSensor(this, callback);
  };
});

module.exports = Sensor;
