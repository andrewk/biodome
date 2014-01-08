var EventEmitter = require('events').EventEmitter
  , util = require('util');

/**
 * Common functionality shared between Devices and Sensors
 */
var Endpoint = function () {
  EventEmitter.call(this);
  this.state = null;
  this.error = null;
  this.updatedAt = null;
  this.value = null;

  this.isState = function(state) {
    return this.state == state;
  };

  this.setValue = function(value) {
    this.updatedNow();
    this.value = value;
  }

  this.toJSON = function() {
    return {
      "id" : this.id,
      "updatedAt" : this.updatedAt,
      "state" : this.state,
      "value" : this.value
    };
  };

  this.setState = function(newState) {
    if (this.state == newState) return;
    this.state = newState;
    this.updatedNow();
  };

  this.updatedNow = function() {
    this.updatedAt =  Math.round(Date.now() / 1000);
    this.emit('updated', this);
  };  
  
  this.error = function(error) {
    this.error = error;
    this.emit('error', this);
  }
};

util.inherit(Endpoint, EventEmitter);

module.exports = Endpoint;
