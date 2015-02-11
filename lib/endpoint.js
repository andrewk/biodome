var Rx = require('rx'),
commandMatcherFactory = require('./command-matcher');

function Endpoint(params) {
  // unique id
  this.id = params.id;

  // Free text
  this.type = params.type;

  // must implement biodome.driver interface
  this.driver = params.driver;

  // provides JSON every time the endpoint hardware is updated
  this.data = params.dataStream || new Rx.Subject();

  this.shouldExecuteCommand = params.commandMatcher || commandMatcherFactory(this);

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
    then((newValue) => {
      this.broadcastData(newValue);   
    });
}

// Read value from hardware
// returns Promise, resolves to JSON
Endpoint.prototype.read = function() {
  return this.driver.
    read().
    then((newValue) => {
      this.broadcastData(newValue);    
    });
};

Endpoint.prototype.subscribeToCommands = function(commands) {
  if (this.commandSubscription) {
    this.commandSubscription.dispose();
  }

  this.commandSubscription = commands.subscribe(
    Rx.Observer.create(
      (command) => {
        if (!this.shouldExecuteCommand(command)) {
          return;
        }
        if (command.instruction.type === 'write') {
          this.write(command.instruction.value);
        } else {
          this.read();
        }
      }
    )
  );
};

Endpoint.prototype.broadcastData = function(value) {
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

  if (this.commandSubscription) {
    this.commandSubscription.dispose();
  }
};

module.exports = Endpoint;
module.exports.new = function(params) {
  return new Endpoint(params);
};
