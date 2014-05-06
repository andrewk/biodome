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

  // indicate update is already happening
  self.busy = true;
  return self.driver.write(value).then(
      function() {
        self.value = value;
        self.markUpdated();
        self.busy = false;
      }
    ).catch(
      function() {
        // cleanup busy marker after error in driver/io chain
        self.busy = false;
      }
    );
}

Endpoint.prototype.read = function() {
  var self = this;

  // indicate update is already happening
  self.busy = true;
  return self.driver.read().then(
      function(value) {
        self.value = value;
        self.markUpdated();
        self.busy = false;
      }
    ).catch(
      function() {
        // cleanup busy marker after error in driver/io chain
        self.busy = false;
      }
    );
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

module.exports = Endpoint;
