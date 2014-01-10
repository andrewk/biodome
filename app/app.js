var lo = require('lodash')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , server = require('./server')

var Biodome = function(nconf) {
  var self = this;
  self.appServer = null;

  // Setup
  self.conf = nconf;
  self.devices = [];
  self.sensors = [];

  // Lazy load server
  self.server = function() {
    if(!self.appServer) {
      self.appServer = server(self);
    }

    return self.appServer;
  };

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
