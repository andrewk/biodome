var Rx = require('rx'),
    log = require('./log'),
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

  // if driver or IO fails during comand execution, it is reported here
  this.errors = params.errorStream || new Rx.Subject();

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

Endpoint.prototype.subscribeToCommands = function(commands) {
  if (this.commandSubscription) {
    this.commandSubscription.dispose();
  }

  this.commandSubscription = commands.subscribe(this.createCommandObserver());
};

Endpoint.prototype.broadcastData = function(value) {
  this.data.onNext({
    'id': this.id,
    'type': this.type,
    'timestamp': Date.now(),
    'value': value
  });
};

Endpoint.prototype.write = function(value) {
  return new Promise((resolve, reject) => {
    this.driver.write(value).
      then(newValue => {
        this.broadcastData(newValue);
        resolve(newValue);
      }).
      catch(e => {
        log.error({
          'source': this.toString(),
          'message': 'Write failed',
          'data': value
        });
        reject(new Error('Hardware failure'));
      });
  });
};

Endpoint.prototype.read = function() {
  return new Promise((resolve, reject) => {
    this.driver.read().
      then(newValue => {
        this.broadcastData(newValue);
        resolve(newValue);
      }).
      catch(e => {
        log.error({
          'source':  this.toString(),
          'message': 'Read failed',
          'data': null
        });
        reject(new Error('Hardware failure'));
      });
  });
};

Endpoint.prototype.createCommandObserver = function() {
  return Rx.Observer.create(
    (command) => {
      if (!this.shouldExecuteCommand(command)) {
        return;
      }

      if (command.instruction.type === 'write') {
        this.write(command.instruction.value).
          catch(e => {
            log.error({
              'source':  'command:' + this,
              'message': 'Command failed',
              'data': command
            });
          });
      } else if (command.instruction.type === 'read') {
        this.read().
          catch(e => {
            log.error({
              'source':  'command:' + this,
              'message': 'Command failed',
              'data': command
            });
          });
      }
    }
  );
}

Endpoint.prototype.toString = function() {
  return 'endpoint:' + this.id;
};

Endpoint.prototype.destroy = function() {
  if (this.commandSubscription) {
    this.commandSubscription.dispose();
  }
};

module.exports = Endpoint;
module.exports.new = function(params) {
  return new Endpoint(params);
};
