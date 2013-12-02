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

  proto.initialize = function(opt) {
    this.id = opt.id;
    this.value = null;
    this.value = null;
    this.updatedAt = Date.now() / 1000;
    this.events = proto.events;
    
    this.initState("init");
  };

  proto.toJSON = function() {
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
