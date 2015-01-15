var Rx = require('rx'),
  commandValidator = require('./command-validator');

function CommandDispatcher() {
  // validated commands, to be executed by endpoint(s)
  this.commandStream = new Rx.Subject();
  this.errorStream = new Rx.Subject();
}

// Observe + validate command intent streams from server
CommandDispatcher.prototype.observe = function(commandIntent) {
  commandIntent.subscribe(c => this.validateCommandIntent(c));
};

CommandDispatcher.prototype.validateCommandIntent = function(command) {
  let validation = this.validator(command);
  if (validation.error) {
    this.commandStream.onError(
      new Error('Invalid command: ' + JSON.stringify(command))
    );
  } else {
    this.commandStream.onNext(command);
  }
};

CommandDispatcher.prototype.validator = function(command) {
  if (!this.validatorInstance) {
    this.validatorInstance = commandValidator;
  }

  return this.validatorInstance(command);
};
