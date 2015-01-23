//=============================================================================
//
//=============================================================================

var Rx = require('rx'),
  defaultCommandMatcher = require('./command-matcher');

function Endpoint(params) {
  // unique id
  this.id = params.id;

  // Free text
  this.type = params.type;

  // must implement biodome.driver interface
  this.driver = params.driver;

  // provides JSON every time the endpoint hardware is updated
  this.data = params.dataStream || new Rx.Subject();

  // last read value
  this.value = null;

  // refresh rate in ms (optional)
  this.refreshRate = params.refreshRate;
  if (this.refreshRate) {
    this.refreshTimer = setInterval(
      this.read.bind(this),
      this.refreshRate
    );
  }
};

// Write value to hardware
// returns Promise, resolves to JSON after write succeeds
Endpoint.prototype.write = function(value) {
  return this.driver.
    write(value).
    then(this.updateFromDriver.bind(this));
}

// Read value from hardware
// returns Promise, resolves to JSON
Endpoint.prototype.read = function() {
  return this.driver.
    read().
    then(this.updateFromDriver.bind(this));
};

Endpoint.prototype.subscribeToCommands = function(commandStream, commandMatcher) {
  commandMatcher = commandMatcher || defaultCommandMatcher;

  commandStream.
    filter(commandMatcher.bind(null, this)).
    subscribe(command => {
      if (command.instruction.type === 'write') {
        this.write(command.instruction.value);
      } else {
        this.read();
      }
    });
};

Endpoint.prototype.updateFromDriver = function(value) {
  this.value = value;
  this.updatedAt = Date.now();
  this.data.onNext({
    'id': this.id,
    'type': this.type,
    'timestamp': Date.now(),
    'value': value
  });
};

Endpoint.prototype.destroy = function() {
  if (this.refreshTimer) {
    clearInterval(this.refreshTimer);
  }
};

module.exports = Endpoint;
module.exports.new = function(params) {
  return new Endpoint(params);
};
