// config from .env
require('envc')();

var lo = require('lodash')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter

var Biodome = function() {
  var self = this;

  // Setup
  self.devices = [];
  self.sensors = [];

  self.addDevice = function(device) {
    this.devices.push(device);
  };

  self.addSensor = function(sensor) {
    this.sensors.push(sensor);
  };

  // Device finder
  self.device = function(id) {
    var dvs = lo.where(self.devices, {'id' : id });
    return (dvs.length == 0) ? null : dvs[0];
  };

  // Sensor finder
  self.sensor = function(id) {
    var ss = lo.where(self.sensors, {'id' : id });
    return (ss.length == 0) ? null : ss[0];
  };
};

util.inherits(Biodome, EventEmitter);

module.exports = Biodome;
module.exports.factory = function() {
  return new Biodome();
}

