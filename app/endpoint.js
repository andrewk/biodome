var EventEmitter = require('events').EventEmitter
  , util = require('util');

/**
 * Common functionality shared between Devices and Sensors
 */
function Endpoint() {
  this.state = null;
  this.error = null;
  this.updatedAt = null;
  this.value = null;
};

util.inherits(Endpoint, EventEmitter);

Endpoint.prototype.isState = function(state) {
  return this.state == state;
};

Endpoint.prototype.setValue = function(value) {
  this.updatedNow();
  this.value = value;
};

Endpoint.prototype.toJSON = function() {
  return {
    "id" : this.id,
    "updatedAt" : this.updatedAt,
    "state" : this.state,
    "value" : this.value
  };
};

Endpoint.prototype.setState = function(newState) {
  if (this.state == newState) return;
  this.state = newState;
  this.updatedNow();
};

Endpoint.prototype.updatedNow = function() {
  this.updatedAt =  Math.round(Date.now() / 1000);
  this.emit('updated', this);
};  

Endpoint.prototype.error = function(error) {
  this.error = error;
  this.emit('error', this);
}

module.exports = Endpoint;
