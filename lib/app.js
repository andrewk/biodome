// config from .env
require('envc')();

var lo = require('lodash')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter;

function App() {
  EventEmitter.call(this);
  this.devices = [];
  this.sensors = [];
}

util.inherits(App, EventEmitter);

App.prototype.addDevice = function(device) {
  this.devices.push(device);
  this.watchEndpoint(device);
};

App.prototype.addSensor = function(sensor) {
  this.sensors.push(sensor);
  this.watchEndpoint(sensor);
};

App.prototype.watchEndpoint = function(endpoint) {
  var self = this;
  var emitter = function(obj) {
    self.emit(obj.type + ':update', endpoint);
  };
  endpoint.on('update:read', emitter);
  endpoint.on('update:write', emitter);
};

// Device finder
App.prototype.device = function(id) {
  var dvs = lo.where(this.devices, {'id' : id });
  return (dvs.length == 0) ? null : dvs[0];
};

// Sensor finder
App.prototype.sensor = function(id) {
  var ss = lo.where(this.sensors, {'id' : id });
  return (ss.length == 0) ? null : ss[0];
};

App.prototype.status = function() {

};

module.exports = App;
module.exports.factory = function() {
  return new App();
};
