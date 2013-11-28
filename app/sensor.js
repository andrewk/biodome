var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , Submachine = require("submachine").Submachine;

var Sensor = Submachine.subclass(function(proto) {
  proto.events = new EventEmitter;

  this.hasStates("init", "ready", "busy", "error");
  this.transition({ from: "*", to: "busy", on: "updateTransition"});
  this.transition({ from: "busy", to: "ready", on: "updateComplete"});

  this.onEnter("*", function() {
    proto.events.emit(this.state);
  });

  this.onEnter('busy', function() {
    this.updateFromSensor();
    this.updateComplete();
  });

  this.onEnter('ready', function() {
    this.updatedAt = Date.now() / 1000;
  });

  proto.initialize = function(id) {
    this.id = id;
    this.value = null;
    this.initState("init");
    this.value = null;
    this.updatedAt = Date.now() / 1000;
    this.events = proto.events;
  };

  proto.toJson = function() {
    return {
      "id" : this.id,
      "updatedAt" : this.updatedAt,
      "state" : this.value
    };
  };

  proto.update = function(callback) {
    this.updateTransition();
    if("function" == typeof callback) callback.call(this);
  };

  proto.updateFromSensor = function() { };

});

module.exports = Sensor;
