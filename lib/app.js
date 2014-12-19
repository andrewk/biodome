// config from .env
require('envc')();

var Promise = require('bluebird');
var commandValidator = require('./command-validator');

function App() {
  this.endpoints = [];
  this.validator = null;
}

// Endpoint finder
App.prototype.endpoint = function(properties) {
  var ep = this.endpointsWhere(properties);
  return (ep.length == 0) ? null : ep[0];
};

App.prototype.endpointsWhere = function(properties) {
  return this.endpoints.filter(function(ep) {
    var match = true;
    for(var key in properties) {
      match = match && ep[key] == properties[key];
    }
    return match;
  });
};

App.prototype.executeCommand = function(command) {
  var endpoints = this.endpointsWhere(command.selector);
  var validation = this.commandValidator(command);

  if (validation.error) {
    return Promise.reject(new Error(validation.error));
  }

  return Promise.all(endpoints.map(function(ep) {
    // read or write
    if (command.instruction.type === 'write') {
      return ep.write(command.instruction.value);
    } else {
      return ep.read();
    }
  }));
};

App.prototype.status = function(endpoints) {
  endpoints = endpoints || this.endpoints;
  return Promise.all(endpoints.map(
    function(ep) {
      return ep.toJSON();
    }
  ));
};

App.prototype.commandValidator = function(command) {
  if (!this.validator) {
    this.validator = commandValidator;
  }

  return this.validator(command);
};

module.exports = App;
module.exports.new = function() {
  return new App();
};
