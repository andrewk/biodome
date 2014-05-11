// config from .env
require('envc')();

var Promise = require('bluebird');
var InstructionValidator = require('./instruction-validator');

function App() {
  this.endpoints = [];
  this.validator = null;
}

// Endpoint finder
App.prototype.endpoint = function(id) {
  var ep = this.endpointsWhere({'id': id});
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

App.prototype.update = function(properties) {
  var endpoints = (conditions) 
    ? this.endpointsWhere(properties)
    : this.endpoints;
  var self = this;

  return Promise.all(
    endpoints.map(function(e) { return e.read(); })
  ).then(function() {
    return self.status(endpoints);
  });
};

App.prototype.executeInstruction = function(instruction) {
  var endpoints = (conditions) 
    ? this.endpointsWhere(properties)
    : this.endpoints;
  var self = this;

  return Promise.all(
    this.endpointsWhere(instruction.selector).map(
      function(ep) { 
        // read or write
        if (instruction.command.type == 'write') {
          
        } else {
          
        }
      }
    )
  ).then(function() {
    return self.status(endpoints);
  });
};

App.prototype.status = function(endpoints) {
  endpoints = endpoints || this.endpoints;
  return endpoints.map(
    function(ep) { 
      return ep.toJSON();
    }
  );
};

module.exports = App;
module.exports.new = function() {
  return new App();
};
