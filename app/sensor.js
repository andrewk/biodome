var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , Submachine = require("submachine").Submachine;

var Sensor = Submachine.subclass(function(proto) {
  this.hasStates("init", "ready", "busy", "error");
  this.transition({ from: "*", to: "busy", on: "markBusy"});
  this.transition({ from: "busy", to: "ready", on: "driverUpdated"});

  this.onEnter("*", function() {
    this.events.emit(this.state, this.toJSON());
  });

  this.onEnter("ready", function() {
    this.updatedAt = Math.floor(Date.now());
    this.events.emit('update', this.toJSON());
  });

  proto.initialize = function(opt) {
    this.id = opt.id;
    this.driver = opt.driver;
    this.updatedAt = null;
    this.events = new EventEmitter;
    
    this.initState("init");
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
    this.driver.update(this, callback);
  };
});

module.exports = Sensor;
