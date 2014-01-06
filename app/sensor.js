var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , Stateful = require('./stateful');

var Sensor = function(opt) {
  var self = this;

  this.id = opt.id;
  this.driver = opt.driver;
  this.updatedAt = null;
  this.events = new EventEmitter;
  this.state = "init";

  this.toJSON = function() {
    return {
      "id" : this.id,
      "updatedAt" : this.updatedAt,
      "state" : this.state,
      "value" : this.value()
    };
  };

  this.value = function() {
    return this.driver.value;
  };

  this.stateChanged = function() {
    this.events.emit(this.state, this.toJSON());
    this.events.emit("update", this.toJSON());
  };

  this.driverUpdated = function() {
    this.setState("ready");
  };

  this.update = function(callback) {
    this.setState("busy");
    this.driver.update(this, function() {
      self.updatedAt = self.timestamp(); 
      if("function" == typeof callback) callback(null, self);
    });
  };
};

Sensor.prototype = new Stateful;

module.exports = Sensor;
