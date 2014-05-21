// config from .env
require('envc')();

var Promise = require('bluebird');
var InstructionValidator = require('./instruction-validator');

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

App.prototype.executeInstruction = function(instruction) {
  var self = this;
  var endpoints = this.endpointsWhere(instruction.selector);
  var validation = this.instructionValidator().validate(instruction);
  if (validation.error) {
    return Promise.reject(new Error(validation.error));
  }

  return Promise.all(endpoints.map(function(ep) {
    // read or write
    if (instruction.command.type === 'write') {
      return ep.write(instruction.command.value);
    } else {
      return ep.read();
    }
  }));
};

App.prototype.status = function(endpoints) {
  endpoints = endpoints || this.endpoints;
  return endpoints.map(
    function(ep) {
      return ep.toJSON();
    }
  );
};

App.prototype.instructionValidator = function() {
  if (!this.validator) {
    this.validator = new InstructionValidator();
  }

  return this.validator;
};

module.exports = App;
module.exports.new = function() {
  return new App();
};
