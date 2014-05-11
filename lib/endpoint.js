/**
 * Common functionality shared between Devices and Sensors
 */
function Endpoint(params) {
  // TODO refactor out this.type
  this.type = params.type;
  this.driver = params.driver;
  this.id = params.id;
  this.error = null;
  this.updatedAt = null;
  this.value = null;
  this.busy = false;
};

Endpoint.prototype.write = function(value) {
  var self = this;

  self.busy = true;
  return self.driver
    .write(value)
    .then(self.updateFromDriver.bind(self));
}

Endpoint.prototype.read = function() {
  var self = this;

  self.busy = true;
  return self.driver
    .read()
    .then(self.updateFromDriver.bind(self));
}

Endpoint.prototype.toJSON = function() {
  return {
    "id" : this.id,
    "updatedAt" : this.updatedAt,
    "value" : this.value,
    "busy" : this.busy
  };
};

Endpoint.prototype.markUpdated = function() {
  this.updatedAt =  Math.round(Date.now() / 1000);
};

Endpoint.prototype.updateFromDriver = function(value) {
  this.value = value;
  this.markUpdated();
  this.busy = false;
  return this.toJSON();
};

module.exports = Endpoint;
