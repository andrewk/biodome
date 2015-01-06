/**
 * Common functionality shared between Devices and Sensors
 */
var Rx = require('rx');

function Endpoint(params) {
  this.type = params.type;
  this.driver = params.driver;
  this.data = new Rx.Subject();
  this.refreshRate = params.refreshRate;
  this.id = params.id;
  this.updatedAt = null;
  this.value = null;
  this.busy = false;

  if (this.refreshRate) {
    this.refreshTimer = setInterval(this.read.bind(this), this.refreshRate);
  }
};

Endpoint.prototype.write = function(value) {
  this.busy = true;
  return this.driver
    .write(value)
    .then(this.updateFromDriver.bind(this));
}

Endpoint.prototype.read = function() {
  this.busy = true;
  return this.driver.
    read().
    then(this.updateFromDriver.bind(this));
};

Endpoint.prototype.toJSON = function() {
  return {
    'id' : this.id,
    'value' : this.value,
    'type': this.type,
    'timestamp' : this.updatedAt
  };
};

Endpoint.prototype.updateFromDriver = function(value) {
  this.value = value;
  this.updatedAt = Date.now();
  this.busy = false;
  this.data.onNext(this);
  return this.toJSON();
};

Endpoint.prototype.destroy = function() {
  if (this.refreshTimer) {
    clearInterval(this.refreshTimer);
  }
  this.data.onCompleted();
};

module.exports = Endpoint;
module.exports.new = function(params) {
  return new Endpoint(params);
};
